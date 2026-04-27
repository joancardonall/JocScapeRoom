// Importem React i ReactDOM des d'un CDN.
import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';

// Alias curt per no escriure React.createElement cada vegada.
const e = React.createElement;

function App() {
  // -----------------------------
  // 1) ESTAT PRINCIPAL DE L'APP
  // -----------------------------
  const [layoutData, setLayoutData] = React.useState(null); // scene-layout.json
  const [caseIndex, setCaseIndex] = React.useState([]); // llista de casos disponibles
  const [selectedCasePath, setSelectedCasePath] = React.useState(''); // cas actual
  const [caseData, setCaseData] = React.useState(null); // JSON del cas carregat
  const [error, setError] = React.useState(''); // missatge d'error
  const [isSolutionVisible, setIsSolutionVisible] = React.useState(false); // panell solució
  const [openWindows, setOpenWindows] = React.useState([]); // finestres obertes

  // Ref per controlar quin z-index va al davant.
  const zCounterRef = React.useRef(40);

  // Retorna un nou z-index (sempre més gran que l'anterior).
  function nextZ() {
    zCounterRef.current = zCounterRef.current + 1;
    return zCounterRef.current;
  }

  // ------------------------------------------
  // 2) CARREGA DE FITXERS DE CONFIGURACIÓ BASE
  // ------------------------------------------
  React.useEffect(function () {
    async function loadLayoutAndIndex() {
      try {
        const responses = await Promise.all([
          fetch('./scene-layout.json', { cache: 'no-store' }),
          fetch('./cases/cases-index.json', { cache: 'no-store' })
        ]);

        const layoutResponse = responses[0];
        const indexResponse = responses[1];

        if (!layoutResponse.ok) {
          throw new Error("No s'ha pogut carregar el layout (" + layoutResponse.status + ')');
        }

        if (!indexResponse.ok) {
          throw new Error("No s'ha pogut carregar l'index de casos (" + indexResponse.status + ')');
        }

        const layout = await layoutResponse.json();
        const index = await indexResponse.json();

        setLayoutData(layout);

        if (Array.isArray(index)) {
          setCaseIndex(index);
        } else {
          setCaseIndex([]);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    loadLayoutAndIndex();
  }, []);

  React.useEffect(function () {
    if (!Array.isArray(caseIndex) || caseIndex.length === 0) {
      return;
    }

    const lastCase = caseIndex[caseIndex.length - 1];
    setSelectedCasePath(lastCase.path || './cases/case-001.json');
  }, [caseIndex]);

  // ---------------------------------
  // 3) CARREGA DEL CAS SELECCIONAT
  // ---------------------------------
  React.useEffect(function () {
    async function loadSelectedCase() {
      if (!selectedCasePath) {
        return;
      }

      try {
        setError('');

        const response = await fetch(selectedCasePath, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error("No s'ha pogut carregar el cas (" + response.status + ')');
        }

        const caseFile = await response.json();
        setCaseData(caseFile);

        // En canviar de cas, netegem finestres i solució.
        setOpenWindows([]);
        setIsSolutionVisible(false);
      } catch (err) {
        setError(err.message);
      }
    }

    loadSelectedCase();
  }, [selectedCasePath]);

  // ---------------------------------
  // 4) DRECERA DE TECLAT (ESC)
  // ---------------------------------
  React.useEffect(function () {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsSolutionVisible(function (prev) {
          return !prev;
        });
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ---------------------------------
  // 5) FUNCIONS D'UTILITAT
  // ---------------------------------
  function getNodeById(nodeId) {
    if (!caseData) {
      return null;
    }
    if (!caseData.fileSystem) {
      return null;
    }
    if (!caseData.fileSystem.nodes) {
      return null;
    }
    if (!caseData.fileSystem.nodes[nodeId]) {
      return null;
    }
    return caseData.fileSystem.nodes[nodeId];
  }

  function getFolderChildren(node) {
    const children = Array.isArray(node.children) ? node.children : [];

    // La carpeta principal només ha de mostrar els informes policials i els testimonis.
    // La resta de seccions ja tenen el seu propi hotspot a l'escena.
    if (node.id === 'main-folder') {
      const allowedRootChildren = ['police-report-folder', 'witnesses-folder'];
      return children.filter(function (childId) {
        return allowedRootChildren.indexOf(childId) !== -1;
      });
    }

    if (node.category === 'suspect') {
      return children.filter(function (childId) {
        const child = getNodeById(childId);
        return !child || child.category !== 'suspect-story';
      });
    }

    return children;
  }

  function getSuspectBaseId(nodeId) {
    if (!nodeId) {
      return '';
    }

    const match = nodeId.match(/^(suspect-.+?)-(?:folder|dossier-doc|profile-doc|backstory-doc|connection-doc|alibi-doc|interrogation-doc)$/);
    return match ? match[1] : '';
  }

  function isSuspectDossierNode(node) {
    return !!node && node.type === 'document' && (node.category === 'suspect-dossier' || node.category === 'suspect-profile');
  }

  function getLinkedBackstoryNode(node) {
    if (!node || node.category !== 'suspect-profile') {
      return null;
    }

    const suspectBaseId = getSuspectBaseId(node.id);
    if (!suspectBaseId) {
      return null;
    }

    const storyNode = getNodeById(suspectBaseId + '-backstory-doc');
    if (!storyNode || storyNode.category !== 'suspect-story') {
      return null;
    }

    return storyNode;
  }

  function getSuspectDisplayName(node) {
    if (!node) {
      return '';
    }

    if (node.suspectName) {
      return node.suspectName;
    }

    if (node.name) {
      return node.name;
    }

    if (node.subtitle && node.subtitle.indexOf(' - ') !== -1) {
      return node.subtitle.split(' - ')[0].trim();
    }

    return node.title || '';
  }

  function getSuspectRole(node) {
    if (!node) {
      return '';
    }

    if (node.suspectRole) {
      return node.suspectRole;
    }

    if (node.role) {
      return node.role;
    }

    if (node.subtitle && node.subtitle.indexOf(' - ') !== -1) {
      return node.subtitle.split(' - ').slice(1).join(' - ').trim();
    }

    return node.subtitle || '';
  }

  function getSuspectPhotoSrc(node) {
    if (node && node.photo) {
      return node.photo;
    }

    const suspectBaseId = getSuspectBaseId(node ? node.id : '');
    if (caseData && caseData.id && suspectBaseId) {
      return './images/suspects/' + caseData.id + '/' + suspectBaseId + '.jpg';
    }

    return './images/default-suspect-photo.svg';
  }

  function getSuspectProfileParagraphs(node) {
    if (!node) {
      return [];
    }

    if (Array.isArray(node.profile) && node.profile.length > 0) {
      return node.profile;
    }

    return Array.isArray(node.content) ? node.content : [];
  }

  function getSuspectHistoryParagraphs(node) {
    if (!node) {
      return [];
    }

    if (Array.isArray(node.personalHistory) && node.personalHistory.length > 0) {
      return node.personalHistory;
    }

    const backstoryNode = getLinkedBackstoryNode(node);
    if (backstoryNode && Array.isArray(backstoryNode.content)) {
      return backstoryNode.content;
    }

    return [];
  }

  function getNodeWindowTitle(node) {
    if (!node) {
      return 'Finestra';
    }

    if (isSuspectDossierNode(node)) {
      return getSuspectDisplayName(node) || node.title || 'Fitxa policial';
    }

    if (node.type === 'suspect') {
      return node.name || node.title || 'Sospitos';
    }

    return node.title || 'Finestra';
  }

  function getNodeListMeta(node, fallbackId) {
    const safeFallback = fallbackId || 'node';

    if (!node) {
      return {
        label: safeFallback,
        iconSrc: './images/file-txt-icon.svg',
        typeLabel: 'Fitxer .txt'
      };
    }

    if (node.type === 'folder') {
      if (node.category === 'suspect') {
        return {
          label: node.title || safeFallback,
          iconSrc: './images/folder-icon.svg',
          typeLabel: 'Expedient sospitos'
        };
      }

      return {
        label: node.title || safeFallback,
        iconSrc: './images/folder-icon.svg',
        typeLabel: 'Carpeta'
      };
    }

    if (node.type === 'suspect') {
      return {
        label: node.name || node.title || safeFallback,
        iconSrc: './images/file-txt-icon.svg',
        typeLabel: 'Declaracio sospitos'
      };
    }

    if (node.type === 'document') {
      if (node.category === 'suspect-dossier' || node.category === 'suspect-profile') {
        return {
          label: getSuspectDisplayName(node) || node.title || safeFallback,
          iconSrc: './images/file-txt-icon.svg',
          typeLabel: 'Fitxa policial'
        };
      }

      if (node.category === 'suspect-story') {
        return {
          label: node.title || safeFallback,
          iconSrc: './images/file-txt-icon.svg',
          typeLabel: 'Historia personal'
        };
      }

      if (node.category === 'suspect-relationship') {
        return {
          label: node.title || safeFallback,
          iconSrc: './images/file-txt-icon.svg',
          typeLabel: 'Vincle amb la victima'
        };
      }

      if (node.category === 'suspect-alibi') {
        return {
          label: node.title || safeFallback,
          iconSrc: './images/file-txt-icon.svg',
          typeLabel: 'Document de coartada'
        };
      }

      if (node.category === 'suspect-interrogation') {
        return {
          label: node.title || safeFallback,
          iconSrc: './images/file-txt-icon.svg',
          typeLabel: 'Interrogatori policial'
        };
      }

      return {
        label: node.title || safeFallback,
        iconSrc: './images/file-txt-icon.svg',
        typeLabel: 'Fitxer .txt'
      };
    }

    return {
      label: node.title || safeFallback,
      iconSrc: './images/file-txt-icon.svg',
      typeLabel: 'Fitxer .txt'
    };
  }

  function openNodeWindow(nodeId) {
    const node = getNodeById(nodeId);
    if (!node) {
      return;
    }

    setOpenWindows(function (prev) {
      const offset = prev.length % 8;
      const windowId = nodeId + '-' + Date.now() + '-' + Math.floor(Math.random() * 100000);

      let width = 38;
      let height = 56;

      if (node.type === 'folder') {
        width = 34;
        height = 44;
      }

      if (isSuspectDossierNode(node)) {
        width = 44;
        height = 68;
      }

      const newWindow = {
        windowId: windowId,
        nodeId: nodeId,
        x: 8 + offset * 2.2,
        y: 8 + offset * 2.4,
        w: width,
        h: height,
        z: nextZ()
      };

      const newList = prev.slice();
      newList.push(newWindow);
      return newList;
    });
  }

  function bringWindowToFront(windowId) {
    setOpenWindows(function (prev) {
      const updated = [];
      for (let i = 0; i < prev.length; i += 1) {
        const win = prev[i];
        if (win.windowId === windowId) {
          updated.push({
            windowId: win.windowId,
            nodeId: win.nodeId,
            x: win.x,
            y: win.y,
            w: win.w,
            h: win.h,
            z: nextZ()
          });
        } else {
          updated.push(win);
        }
      }
      return updated;
    });
  }

  function closeWindow(windowId) {
    setOpenWindows(function (prev) {
      const updated = [];
      for (let i = 0; i < prev.length; i += 1) {
        if (prev[i].windowId !== windowId) {
          updated.push(prev[i]);
        }
      }
      return updated;
    });
  }

  function openFromHotspot(hotspotId) {
    if (!layoutData) {
      return;
    }
    if (!layoutData.hotspotActions) {
      return;
    }

    const targetNodeId = layoutData.hotspotActions[hotspotId];
    if (targetNodeId) {
      openNodeWindow(targetNodeId);
    }
  }

  // ---------------------------------
  // 6) VISTES D'ERROR I CÀRREGA
  // ---------------------------------
  if (error) {
    return e(
      'main',
      { style: { padding: '24px', fontFamily: 'Arial, sans-serif' } },
      e('h1', null, 'Error'),
      e('p', { style: { color: '#8b0000' } }, error)
    );
  }

  if (!layoutData || !caseData) {
    return e(
      'main',
      { style: { padding: '24px', fontFamily: 'Arial, sans-serif' } },
      e('h1', null, 'Carregant...'),
      e('p', null, "Preparant l'escena del cas")
    );
  }

  // ---------------------------------
  // 7) CONSTRUCCIÓ DELS ELEMENTS UI
  // ---------------------------------
  const mainChildren = [];

  // 7.1) Hotspots invisibles
  const hotspots = layoutData.hotspots || [];
  for (let i = 0; i < hotspots.length; i += 1) {
    const hotspot = hotspots[i];
    mainChildren.push(
      e(
        'button',
        {
          key: hotspot.id,
          onClick: function () {
            openFromHotspot(hotspot.id);
          },
          title: hotspot.label,
          style: {
            position: 'absolute',
            left: hotspot.x + '%',
            top: hotspot.y + '%',
            width: hotspot.w + '%',
            height: hotspot.h + '%',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }
        },
        ''
      )
    );
  }

  // 7.2) Selector de cas
  const selectOptions = [];
  if (caseIndex.length > 0) {
    for (let i = 0; i < caseIndex.length; i += 1) {
      const item = caseIndex[i];
      const keyValue = item.id || item.path;
      const optionValue = item.path;
      const optionText = (item.id || 'cas') + ' - ' + (item.title || item.path);
      selectOptions.push(e('option', { key: keyValue, value: optionValue }, optionText));
    }
  } else {
    selectOptions.push(e('option', { key: 'default', value: selectedCasePath }, selectedCasePath));
  }

  mainChildren.push(
    e(
      'section',
      {
        style: {
          position: 'absolute',
          left: '2%',
          top: '3%',
          width: '360px',
          background: 'rgba(248, 241, 228, 0.96)',
          border: '1px solid #8f7756',
          borderRadius: '10px',
          padding: '10px',
          zIndex: 5000
        }
      },
      e(
        'label',
        {
          htmlFor: 'case-selector',
          style: {
            display: 'block',
            fontSize: '13px',
            marginBottom: '6px',
            color: '#2b2016',
            fontWeight: '600'
          }
        },
        'Cas actiu'
      ),
      e(
        'select',
        {
          id: 'case-selector',
          value: selectedCasePath,
          onChange: function (event) {
            setSelectedCasePath(event.target.value);
          },
          style: {
            width: '100%',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid #9d8461',
            background: '#fffdf8',
            padding: '0 8px',
            fontSize: '14px'
          }
        },
        selectOptions
      )
    )
  );

  // 7.3) Finestres obertes
  for (let i = 0; i < openWindows.length; i += 1) {
    const win = openWindows[i];
    const node = getNodeById(win.nodeId);

    if (!node) {
      continue;
    }

    const bodyChildren = [];

    // Contingut per carpetes
    if (node.type === 'folder') {
      if (node.description) {
        bodyChildren.push(e('p', { style: { marginTop: 0 }, key: win.windowId + '-desc' }, node.description));
      }

      const children = getFolderChildren(node);
      for (let j = 0; j < children.length; j += 1) {
        const childId = children[j];
        const child = getNodeById(childId);

        const childMeta = getNodeListMeta(child, childId);
        const childLabel = childMeta.label;
        const iconSrc = childMeta.iconSrc;
        const typeLabel = childMeta.typeLabel;

        bodyChildren.push(
          e(
            'button',
            {
              key: childId,
              onClick: function () {
                openNodeWindow(childId);
              },
              style: {
                width: '100%',
                marginBottom: '8px',
                padding: '9px',
                border: '1px solid #c9b79b',
                borderRadius: '12px',
                background: '#fffaf1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }
            },
            e('img', {
              src: iconSrc,
              alt: typeLabel,
              style: {
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f4ecdf',
                padding: '4px',
                boxSizing: 'border-box',
                flex: '0 0 auto'
              }
            }),
            e(
              'div',
              { style: { textAlign: 'left', minWidth: 0 } },
              e(
                'div',
                {
                  style: {
                    fontSize: '14px',
                    color: '#2a2118',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                },
                childLabel
              ),
              e('div', { style: { fontSize: '12px', color: '#6a5640' } }, typeLabel)
            )
          )
        );
      }
    }

    // Contingut per documents
    if (node.type === 'document') {
      if (isSuspectDossierNode(node)) {
        const suspectName = getSuspectDisplayName(node);
        const suspectRole = getSuspectRole(node);
        const suspectPhotoSrc = getSuspectPhotoSrc(node);
        const profileParagraphs = getSuspectProfileParagraphs(node);
        const historyParagraphs = getSuspectHistoryParagraphs(node);
        const profileChildren = [];
        const historyChildren = [];

        for (let j = 0; j < profileParagraphs.length; j += 1) {
          profileChildren.push(
            e(
              'p',
              {
                key: node.id + '-profile-' + j,
                style: { lineHeight: 1.5, margin: '0 0 10px', color: '#251b12' }
              },
              profileParagraphs[j]
            )
          );
        }

        for (let j = 0; j < historyParagraphs.length; j += 1) {
          historyChildren.push(
            e(
              'p',
              {
                key: node.id + '-history-' + j,
                style: { lineHeight: 1.5, margin: '0 0 10px', color: '#251b12' }
              },
              historyParagraphs[j]
            )
          );
        }

        bodyChildren.push(
          e(
            'section',
            {
              key: node.id + '-dossier',
              style: {
                background: 'linear-gradient(180deg, #f7f1e4 0%, #efe3cf 100%)',
                border: '1px solid #b89e76',
                borderRadius: '14px',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.45)',
                overflow: 'hidden'
              }
            },
            e(
              'div',
              {
                style: {
                  padding: '14px 16px',
                  borderBottom: '1px solid #c9b08a',
                  background: '#e6d2b2'
                }
              },
              e(
                'div',
                {
                  style: {
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#6f5230',
                    marginBottom: '6px'
                  }
                },
                node.title || 'Fitxa policial'
              ),
              e(
                'div',
                {
                  style: {
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#24190f'
                  }
                },
                suspectName || 'Sospitós sense identificar'
              ),
              suspectRole
                ? e(
                    'div',
                    {
                      style: {
                        marginTop: '4px',
                        color: '#5c4330',
                        fontStyle: 'italic'
                      }
                    },
                    suspectRole
                  )
                : null
            ),
            e(
              'div',
              {
                style: {
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px'
                }
              },
              e(
                'aside',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '220px',
                    flex: '0 0 220px'
                  }
                },
                e('img', {
                  src: suspectPhotoSrc,
                  alt: suspectName || 'Retrat del sospitós',
                  onError: function (event) {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = './images/default-suspect-photo.svg';
                  },
                  style: {
                    width: '100%',
                    height: '294px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid #9b7f59',
                    background: '#d9c7ab'
                  }
                }),
                e(
                  'div',
                  {
                    style: {
                      border: '1px solid #ccb28d',
                      borderRadius: '12px',
                      background: 'rgba(255, 250, 241, 0.85)',
                      padding: '12px'
                    }
                  },
                  e(
                    'div',
                    {
                      style: {
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: '#73573a',
                        marginBottom: '8px',
                        fontWeight: '700'
                      }
                    },
                    'Dades visibles'
                  ),
                  e('p', { style: { margin: '0 0 6px', lineHeight: 1.4 } }, 'Nom: ' + (suspectName || 'No informat')),
                  e('p', { style: { margin: 0, lineHeight: 1.4 } }, 'Càrrec: ' + (suspectRole || 'No informat'))
                )
              ),
              e(
                'div',
                { style: { minWidth: '260px', flex: '1 1 320px' } },
                e(
                  'section',
                  {
                    style: {
                      marginBottom: historyChildren.length > 0 ? '16px' : '0',
                      border: '1px solid #d7c1a0',
                      borderRadius: '12px',
                      background: 'rgba(255, 251, 244, 0.92)',
                      padding: '14px'
                    }
                  },
                  e(
                    'h3',
                    {
                      style: {
                        margin: '0 0 12px',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#694c2d'
                      }
                    },
                    'Perfil bàsic'
                  ),
                  profileChildren
                ),
                historyChildren.length > 0
                  ? e(
                      'section',
                      {
                        style: {
                          border: '1px solid #d7c1a0',
                          borderRadius: '12px',
                          background: 'rgba(255, 251, 244, 0.92)',
                          padding: '14px'
                        }
                      },
                      e(
                        'h3',
                        {
                          style: {
                            margin: '0 0 12px',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#694c2d'
                          }
                        },
                        'Història personal'
                      ),
                      historyChildren
                    )
                  : null
              )
            )
          )
        );
      } else {
        if (node.subtitle) {
          bodyChildren.push(
            e(
              'p',
              {
                key: win.windowId + '-subtitle',
                style: { marginTop: 0, fontStyle: 'italic', color: '#5f4a35' }
              },
              node.subtitle
            )
          );
        }

        const paragraphs = node.content || [];
        for (let j = 0; j < paragraphs.length; j += 1) {
          bodyChildren.push(
            e(
              'p',
              {
                key: node.id + '-p-' + j,
                style: { lineHeight: 1.42, marginBottom: '10px' }
              },
              paragraphs[j]
            )
          );
        }
      }
    }

    // Contingut per sospitosos
    if (node.type === 'suspect') {
      bodyChildren.push(e('p', { key: node.id + '-name', style: { marginTop: 0, marginBottom: '6px' } }, 'Nom: ' + (node.name || '-')));
      bodyChildren.push(e('p', { key: node.id + '-role', style: { marginTop: 0, marginBottom: '6px' } }, 'Rol: ' + (node.role || '-')));
      bodyChildren.push(
        e(
          'p',
          {
            key: node.id + '-alibi',
            style: {
              marginTop: 0,
              marginBottom: '12px',
              background: '#f5ede0',
              border: '1px solid #d8c7ab',
              borderRadius: '8px',
              padding: '8px'
            }
          },
          'Coartada declarada: ' + (node.alibi || '-')
        )
      );

      const statements = node.statement || [];
      for (let j = 0; j < statements.length; j += 1) {
        bodyChildren.push(
          e(
            'p',
            {
              key: node.id + '-s-' + j,
              style: { lineHeight: 1.42, marginBottom: '10px' }
            },
            statements[j]
          )
        );
      }
    }

    mainChildren.push(
      e(
        'section',
        {
          key: win.windowId,
          onMouseDown: function () {
            bringWindowToFront(win.windowId);
          },
          style: {
            position: 'absolute',
            left: win.x + '%',
            top: win.y + '%',
            width: win.w + '%',
            height: win.h + '%',
            minWidth: '320px',
            minHeight: '220px',
            background: 'rgba(252, 248, 240, 0.98)',
            border: '1px solid #8f7756',
            borderRadius: '10px',
            boxShadow: '0 12px 26px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            animation: 'popupIn 170ms ease-out',
            zIndex: win.z
          }
        },
        e(
          'header',
          {
            style: {
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px 0 12px',
              borderBottom: '1px solid #cbb99e',
              background: '#efe4d1'
            }
          },
          e(
            'div',
            {
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#2c2116',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                paddingRight: '8px'
              }
            },
            getNodeWindowTitle(node)
          ),
          e(
            'button',
            {
              onClick: function () {
                closeWindow(win.windowId);
              },
              style: {
                width: '30px',
                height: '30px',
                border: '1px solid #664f37',
                borderRadius: '6px',
                background: '#f6efe3',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: '18px'
              }
            },
            '×'
          )
        ),
        e(
          'div',
          {
            style: {
              height: 'calc(100% - 44px)',
              overflow: 'auto',
              padding: '12px'
            }
          },
          bodyChildren
        )
      )
    );
  }

  // 7.4) Botó de solució
  mainChildren.push(
    e(
      'button',
      {
        onClick: function () {
          setIsSolutionVisible(function (prev) {
            return !prev;
          });
        },
        style: {
          position: 'absolute',
          left: '2%',
          bottom: '3%',
          width: '18%',
          minWidth: '190px',
          padding: '10px 12px',
          background: '#171717',
          color: '#fff',
          border: '1px solid #000',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: 'clamp(12px, 1vw, 16px)'
        }
      },
      isSolutionVisible ? 'Amagar solució' : 'Veure solució (Esc)'
    )
  );

  // 7.5) Panell de solució
  if (isSolutionVisible) {
    const solutionChildren = [];

    solutionChildren.push(e('p', { key: 'sol-1', style: { margin: '0 0 6px' } }, 'Culpable: ' + caseData.solution.culprit));
    solutionChildren.push(e('p', { key: 'sol-2', style: { margin: '0 0 6px' } }, 'Motiu: ' + caseData.solution.motive));
    solutionChildren.push(e('p', { key: 'sol-3', style: { margin: '0 0 6px' } }, 'Mètode: ' + caseData.solution.method));
    solutionChildren.push(e('p', { key: 'sol-4', style: { margin: '0 0 10px' } }, 'Prova clau: ' + caseData.solution.keyProof));

    if (Array.isArray(caseData.solution.eliminations) && caseData.solution.eliminations.length > 0) {
      solutionChildren.push(e('p', { key: 'sol-5', style: { margin: '0 0 6px', fontWeight: '600' } }, 'Per què no els altres sospitosos:'));
      for (let i = 0; i < caseData.solution.eliminations.length; i += 1) {
        solutionChildren.push(
          e('p', { key: 'sol-elim-' + i, style: { margin: '0 0 6px' } }, '- ' + caseData.solution.eliminations[i])
        );
      }
    }

    mainChildren.push(
      e(
        'section',
        {
          style: {
            position: 'absolute',
            left: '2%',
            bottom: '12%',
            width: '46%',
            background: 'rgba(240, 248, 239, 0.97)',
            border: '1px solid #7b966f',
            borderRadius: '8px',
            padding: '1%',
            animation: 'popupIn 180ms ease-out'
          }
        },
        solutionChildren
      )
    );
  }

  // ---------------------------------
  // 8) RETORN FINAL DE L'ESCENA
  // ---------------------------------
  return e(
    'main',
    {
      style: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: 'url(' + layoutData.sceneImage + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Arial, sans-serif'
      }
    },
    mainChildren
  );
}

// Muntem l'aplicacio React al div #root.
const root = createRoot(document.getElementById('root'));
root.render(e(App));
