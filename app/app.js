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
  const [selectedLayoutId, setSelectedLayoutId] = React.useState('italian-villa-art'); // estil visual actual
  const [selectedCasePath] = React.useState('./cases/case-018.json'); // cas actual
  const [caseData, setCaseData] = React.useState(null); // JSON del cas carregat
  const [error, setError] = React.useState(''); // missatge d'error
  const [isSolutionVisible, setIsSolutionVisible] = React.useState(false); // panell solució
  const [openWindows, setOpenWindows] = React.useState([]); // finestres obertes

  // Ref per controlar quin z-index va al davant.
  const zCounterRef = React.useRef(40);
  const dragRef = React.useRef(null);

  // Retorna un nou z-index (sempre més gran que l'anterior).
  function nextZ() {
    zCounterRef.current = zCounterRef.current + 1;
    return zCounterRef.current;
  }

  // ------------------------------------------
  // 2) CARREGA DE FITXERS DE CONFIGURACIÓ BASE
  // ------------------------------------------
  React.useEffect(function () {
    async function loadLayout() {
      try {
        const layoutResponse = await fetch('./scene-layout.json', { cache: 'no-store' });

        if (!layoutResponse.ok) {
          throw new Error("No s'ha pogut carregar el layout (" + layoutResponse.status + ')');
        }

        const layout = await layoutResponse.json();

        setLayoutData(layout);
      } catch (err) {
        setError(err.message);
      }
    }

    loadLayout();
  }, []);

  React.useEffect(
    function () {
      if (!layoutData) {
        return;
      }

      const layouts = getAvailableLayouts();
      if (layouts.length === 0) {
        return;
      }

      let selectedLayoutExists = false;
      for (let i = 0; i < layouts.length; i += 1) {
        if (getLayoutId(layouts[i], i) === selectedLayoutId) {
          selectedLayoutExists = true;
        }
      }

      if (!selectedLayoutExists) {
        setSelectedLayoutId(getLayoutId(layouts[0], 0));
      }
    },
    [layoutData, selectedLayoutId]
  );

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

  React.useEffect(function () {
    function handleMouseMove(event) {
      if (!dragRef.current) {
        return;
      }

      event.preventDefault();

      const drag = dragRef.current;
      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;
      const deltaX = ((event.clientX - drag.startMouseX) / viewportWidth) * 100;
      const deltaY = ((event.clientY - drag.startMouseY) / viewportHeight) * 100;

      setOpenWindows(function (prev) {
        const updated = [];

        for (let i = 0; i < prev.length; i += 1) {
          const win = prev[i];

          if (win.windowId === drag.windowId) {
            const maxX = Math.max(0, 100 - win.w);
            const maxY = Math.max(0, 100 - win.h);
            const nextX = Math.min(maxX, Math.max(0, drag.startX + deltaX));
            const nextY = Math.min(maxY, Math.max(0, drag.startY + deltaY));

            updated.push(Object.assign({}, win, { x: nextX, y: nextY }));
          } else {
            updated.push(win);
          }
        }

        return updated;
      });
    }

    function handleMouseUp() {
      dragRef.current = null;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return function () {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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

  function getLayoutId(layout, index) {
    if (layout && layout.id) {
      return layout.id;
    }

    return 'layout-' + index;
  }

  function getAvailableLayouts() {
    if (!layoutData) {
      return [];
    }

    if (Array.isArray(layoutData.styles) && layoutData.styles.length > 0) {
      return layoutData.styles;
    }

    return [layoutData];
  }

  function getActiveLayout() {
    const layouts = getAvailableLayouts();
    if (layouts.length === 0) {
      return null;
    }

    for (let i = 0; i < layouts.length; i += 1) {
      if (getLayoutId(layouts[i], i) === selectedLayoutId) {
        return layouts[i];
      }
    }

    return layouts[0];
  }

  function mergeTheme(baseTheme, customTheme) {
    const merged = {};

    for (const sectionName in baseTheme) {
      if (Object.prototype.hasOwnProperty.call(baseTheme, sectionName)) {
        merged[sectionName] = Object.assign({}, baseTheme[sectionName]);
      }
    }

    if (customTheme) {
      for (const sectionName in customTheme) {
        if (Object.prototype.hasOwnProperty.call(customTheme, sectionName)) {
          merged[sectionName] = Object.assign({}, merged[sectionName] || {}, customTheme[sectionName]);
        }
      }
    }

    return merged;
  }

  function getDefaultTheme() {
    return {
      chrome: {
        labelColor: '#fff7ea',
        labelShadow: '0 1px 3px rgba(0, 0, 0, 0.75)',
        selectBackground: 'rgba(20, 18, 16, 0.34)',
        selectBorder: '1px solid rgba(255, 255, 255, 0.38)',
        selectColor: '#fff8ed',
        selectShadow: '0 1px 4px rgba(0, 0, 0, 0.18)'
      },
      window: {
        background: 'rgba(252, 248, 240, 0.98)',
        border: '1px solid #8f7756',
        borderRadius: '10px',
        shadow: '0 12px 26px rgba(0, 0, 0, 0.35)',
        headerBackground: '#efe4d1',
        headerBorder: '1px solid #cbb99e',
        titleColor: '#2c2116',
        bodyColor: '#251b12',
        closeBackground: '#f6efe3',
        closeBorder: '1px solid #664f37',
        closeColor: '#1f1710'
      },
      listItem: {
        background: '#fffaf1',
        border: '1px solid #c9b79b',
        borderRadius: '12px',
        iconBackground: '#f4ecdf',
        titleColor: '#2a2118',
        metaColor: '#6a5640'
      },
      dossier: {
        background: 'linear-gradient(180deg, #f7f1e4 0%, #efe3cf 100%)',
        border: '1px solid #b89e76',
        headerBackground: '#e6d2b2',
        headerBorder: '1px solid #c9b08a',
        eyebrowColor: '#6f5230',
        titleColor: '#24190f',
        subtitleColor: '#5c4330',
        cardBackground: 'rgba(255, 251, 244, 0.92)',
        cardBorder: '1px solid #d7c1a0',
        cardTitleColor: '#694c2d',
        photoBorder: '1px solid #9b7f59',
        photoBackground: '#d9c7ab'
      },
      solution: {
        buttonBackground: '#171717',
        buttonColor: '#fff',
        buttonBorder: '1px solid #000',
        panelBackground: 'rgba(240, 248, 239, 0.97)',
        panelBorder: '1px solid #7b966f',
        panelColor: '#1f2a1c'
      }
    };
  }

  function getActiveTheme() {
    const activeLayout = getActiveLayout();
    const customTheme = activeLayout && activeLayout.theme ? activeLayout.theme : null;
    return mergeTheme(getDefaultTheme(), customTheme);
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

  function isGenericSuspectDossierTitle(title) {
    const normalizedTitle = (title || '').trim().toLowerCase();
    return normalizedTitle === 'fitxa policial' || normalizedTitle === 'perfil policial';
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

    if (isSuspectDossierNode(node) && isGenericSuspectDossierTitle(node.title) && node.subtitle) {
      return node.subtitle;
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

    if (isSuspectDossierNode(node) && isGenericSuspectDossierTitle(node.title)) {
      return '';
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
          updated.push(Object.assign({}, win, { z: nextZ() }));
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

  function startWindowDrag(windowId, event) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    bringWindowToFront(windowId);

    setOpenWindows(function (prev) {
      for (let i = 0; i < prev.length; i += 1) {
        const win = prev[i];

        if (win.windowId === windowId) {
          dragRef.current = {
            windowId: windowId,
            startMouseX: event.clientX,
            startMouseY: event.clientY,
            startX: win.x,
            startY: win.y
          };
          break;
        }
      }

      return prev;
    });
  }

  function openFromHotspot(hotspotId) {
    const activeLayout = getActiveLayout();
    if (!activeLayout) {
      return;
    }
    if (!activeLayout.hotspotActions) {
      return;
    }

    const targetNodeId = activeLayout.hotspotActions[hotspotId];
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
  const activeLayout = getActiveLayout();
  const activeTheme = getActiveTheme();

  // 7.1) Hotspots invisibles
  const hotspots = activeLayout && Array.isArray(activeLayout.hotspots) ? activeLayout.hotspots : [];
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

  // 7.2) Finestres obertes
  for (let i = 0; i < openWindows.length; i += 1) {
    const win = openWindows[i];
    const node = getNodeById(win.nodeId);

    if (!node) {
      continue;
    }

    const bodyChildren = [];

    // Contingut per carpetes
    if (node.type === 'folder') {
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
                border: activeTheme.listItem.border,
                borderRadius: activeTheme.listItem.borderRadius,
                background: activeTheme.listItem.background,
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
                background: activeTheme.listItem.iconBackground,
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
                    color: activeTheme.listItem.titleColor,
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                },
                childLabel
              ),
              e('div', { style: { fontSize: '12px', color: activeTheme.listItem.metaColor } }, typeLabel)
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
                style: { lineHeight: 1.5, margin: '0 0 10px', color: activeTheme.window.bodyColor }
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
                style: { lineHeight: 1.5, margin: '0 0 10px', color: activeTheme.window.bodyColor }
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
                background: activeTheme.dossier.background,
                border: activeTheme.dossier.border,
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
                  borderBottom: activeTheme.dossier.headerBorder,
                  background: activeTheme.dossier.headerBackground
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
                    color: activeTheme.dossier.eyebrowColor,
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
                    color: activeTheme.dossier.titleColor
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
                        color: activeTheme.dossier.subtitleColor,
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
                    border: activeTheme.dossier.photoBorder,
                    background: activeTheme.dossier.photoBackground
                  }
                }),
                e(
                  'div',
                  {
                    style: {
                      border: activeTheme.dossier.cardBorder,
                      borderRadius: '12px',
                      background: activeTheme.dossier.cardBackground,
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
                        color: activeTheme.dossier.cardTitleColor,
                        marginBottom: '8px',
                        fontWeight: '700'
                      }
                    },
                    'Dades visibles'
                  ),
                  e('p', { style: { margin: '0 0 6px', lineHeight: 1.4, color: activeTheme.window.bodyColor } }, 'Nom: ' + (suspectName || 'No informat')),
                  e('p', { style: { margin: 0, lineHeight: 1.4, color: activeTheme.window.bodyColor } }, 'Càrrec: ' + (suspectRole || 'No informat'))
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
                      border: activeTheme.dossier.cardBorder,
                      borderRadius: '12px',
                      background: activeTheme.dossier.cardBackground,
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
                        color: activeTheme.dossier.cardTitleColor
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
                          border: activeTheme.dossier.cardBorder,
                          borderRadius: '12px',
                          background: activeTheme.dossier.cardBackground,
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
                            color: activeTheme.dossier.cardTitleColor
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
                style: { marginTop: 0, fontStyle: 'italic', color: activeTheme.dossier.subtitleColor }
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
                  style: { lineHeight: 1.42, marginBottom: '10px', color: activeTheme.window.bodyColor }
              },
              paragraphs[j]
            )
          );
        }
      }
    }

    // Contingut per sospitosos
    if (node.type === 'suspect') {
      bodyChildren.push(e('p', { key: node.id + '-name', style: { marginTop: 0, marginBottom: '6px', color: activeTheme.window.bodyColor } }, 'Nom: ' + (node.name || '-')));
      bodyChildren.push(e('p', { key: node.id + '-role', style: { marginTop: 0, marginBottom: '6px', color: activeTheme.window.bodyColor } }, 'Rol: ' + (node.role || '-')));
      bodyChildren.push(
        e(
          'p',
          {
            key: node.id + '-alibi',
            style: {
              marginTop: 0,
              marginBottom: '12px',
              background: activeTheme.dossier.cardBackground,
              border: activeTheme.dossier.cardBorder,
              borderRadius: '8px',
              padding: '8px',
              color: activeTheme.window.bodyColor
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
              style: { lineHeight: 1.42, marginBottom: '10px', color: activeTheme.window.bodyColor }
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
            background: activeTheme.window.background,
            border: activeTheme.window.border,
            borderRadius: activeTheme.window.borderRadius,
            boxShadow: activeTheme.window.shadow,
            overflow: 'hidden',
            animation: 'popupIn 170ms ease-out',
            zIndex: win.z
          }
        },
        e(
          'header',
          {
            onMouseDown: function (event) {
              startWindowDrag(win.windowId, event);
            },
            style: {
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px 0 12px',
              borderBottom: activeTheme.window.headerBorder,
              background: activeTheme.window.headerBackground,
              cursor: 'move',
              userSelect: 'none'
            }
          },
          e(
            'div',
            {
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: activeTheme.window.titleColor,
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
              onMouseDown: function (event) {
                event.stopPropagation();
              },
              onClick: function () {
                closeWindow(win.windowId);
              },
              style: {
                width: '30px',
                height: '30px',
                border: activeTheme.window.closeBorder,
                borderRadius: '6px',
                background: activeTheme.window.closeBackground,
                color: activeTheme.window.closeColor,
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
          background: activeTheme.solution.buttonBackground,
          color: activeTheme.solution.buttonColor,
          border: activeTheme.solution.buttonBorder,
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

    solutionChildren.push(e('p', { key: 'sol-1', style: { margin: '0 0 6px', color: activeTheme.solution.panelColor } }, 'Culpable: ' + caseData.solution.culprit));
    solutionChildren.push(e('p', { key: 'sol-2', style: { margin: '0 0 6px', color: activeTheme.solution.panelColor } }, 'Motiu: ' + caseData.solution.motive));
    solutionChildren.push(e('p', { key: 'sol-3', style: { margin: '0 0 6px', color: activeTheme.solution.panelColor } }, 'Mètode: ' + caseData.solution.method));
    solutionChildren.push(e('p', { key: 'sol-4', style: { margin: '0 0 10px', color: activeTheme.solution.panelColor } }, 'Prova clau: ' + caseData.solution.keyProof));

    if (Array.isArray(caseData.solution.eliminations) && caseData.solution.eliminations.length > 0) {
      solutionChildren.push(e('p', { key: 'sol-5', style: { margin: '0 0 6px', fontWeight: '600', color: activeTheme.solution.panelColor } }, 'Per què no els altres sospitosos:'));
      for (let i = 0; i < caseData.solution.eliminations.length; i += 1) {
        solutionChildren.push(
          e('p', { key: 'sol-elim-' + i, style: { margin: '0 0 6px', color: activeTheme.solution.panelColor } }, '- ' + caseData.solution.eliminations[i])
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
            background: activeTheme.solution.panelBackground,
            border: activeTheme.solution.panelBorder,
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
        backgroundImage: 'url(' + activeLayout.sceneImage + ')',
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
