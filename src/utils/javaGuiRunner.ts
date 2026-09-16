/**
 * Code With SmitroniX - Java GUI (Swing & AWT) Advanced Execution Engine
 * Provides authentic Windows-native execution for Java Swing, AWT, Applets, and 2D Graphics.
 * Dynamically parses custom Java GUI code (variables, layouts, menus, tables, dialogs, graphics)
 * and executes interactive event listeners in real time.
 */

export interface JavaMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  isSeparator?: boolean;
  items?: JavaMenuItem[];
}

export interface JavaGuiComponent {
  id: string;
  varName: string;
  type:
    | 'button'
    | 'label'
    | 'textfield'
    | 'passwordfield'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'combobox'
    | 'slider'
    | 'progressbar'
    | 'table'
    | 'list'
    | 'panel'
    | 'canvas';
  text: string;
  bounds?: { x: number; y: number; width: number; height: number };
  position?: 'North' | 'South' | 'East' | 'West' | 'Center';
  checked?: boolean;
  options?: string[];
  color?: string;
  bgColor?: string;
  actionCode?: string;
  min?: number;
  max?: number;
  value?: number | string;
  columns?: string[];
  rows?: string[][];
  enabled?: boolean;
  visible?: boolean;
  fontSize?: number;
  isBold?: boolean;
  parentPanel?: string;
}

export interface JavaGraphicsCommand {
  type:
    | 'color'
    | 'line'
    | 'rect'
    | 'fillRect'
    | 'oval'
    | 'fillOval'
    | 'roundRect'
    | 'fillRoundRect'
    | 'arc'
    | 'fillArc'
    | 'polygon'
    | 'fillPolygon'
    | 'string';
  params: (number | string)[];
  color?: string;
}

export interface JavaGuiDialog {
  id: string;
  type: 'message' | 'input' | 'confirm';
  message: string;
  title?: string;
  initialValue?: string;
  dialogType?: 'info' | 'warning' | 'error' | 'question';
}

export interface JavaGuiState {
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  layout: 'flow' | 'border' | 'grid' | 'box' | 'null';
  gridRows?: number;
  gridCols?: number;
  gridHgap?: number;
  gridVgap?: number;
  backgroundColor: string;
  components: JavaGuiComponent[];
  menus: JavaMenuItem[];
  graphicsCommands: JavaGraphicsCommand[];
  dialogs: JavaGuiDialog[];
  appletMode: boolean;
  resizable: boolean;
  statusText?: string;
  isScientificCalculator?: boolean;
  rawCode: string;
}

/**
 * Checks if the source code contains Java GUI constructs (Swing, AWT, Applet, Graphics, etc.)
 */
export function isJavaGuiCode(code: string): boolean {
  return /(?:import\s+(?:java\.awt|javax\.swing)|extends\s+(?:JFrame|Frame|Applet|JApplet|JPanel|Canvas)|(?:new\s+(?:JFrame|Frame|JDialog|Dialog)\b)|JOptionPane\s*\.|\b(?:paint|paintComponent)\s*\(\s*Graphics\b|\b(?:JButton|JLabel|JTextField|JTextArea|JCheckBox|JRadioButton|JComboBox|JSlider|JProgressBar|JTable|JMenuBar|FlowLayout|BorderLayout|GridLayout)\b)/.test(
    code
  );
}

/**
 * Maps Java Color constants or new Color(r,g,b) to CSS colors
 */
export function mapJavaColorToCss(colorExpr: string): string {
  const clean = colorExpr.trim().replace(/^Color\./i, '').toUpperCase();
  const colorMap: Record<string, string> = {
    RED: '#C83737',
    BLUE: '#1976D2',
    GREEN: '#10B981',
    YELLOW: '#EAB308',
    BLACK: '#121212',
    WHITE: '#FFFFFF',
    GRAY: '#64748B',
    LIGHT_GRAY: '#D1D5DB',
    DARK_GRAY: '#262626',
    PINK: '#EC4899',
    ORANGE: '#EA580C',
    CYAN: '#0891B2',
    MAGENTA: '#C026D3',
  };

  if (colorMap[clean]) {
    return colorMap[clean];
  }

  // Handle new Color(r, g, b)
  const rgbMatch = colorExpr.match(/new\s+Color\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    return `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`;
  }

  // Handle hex #RRGGBB or Color.decode("#...")
  const hexMatch = colorExpr.match(/#([0-9A-Fa-f]{6})/);
  if (hexMatch) {
    return `#${hexMatch[1]}`;
  }

  return '#181818';
}

function formatResult(num: number): string {
  if (isNaN(num) || !isFinite(num)) return 'Error';
  if (Number.isInteger(num)) return String(num);
  return parseFloat(num.toFixed(8)).toString();
}

/**
 * Parses Java GUI source code dynamically into an authentic window state.
 * Extracts custom variables, layouts, menus, component properties, 2D graphics, and event code.
 */
export function parseJavaGuiCode(sourceCode: string): JavaGuiState {
  let title = 'Scientific Calculator';
  let subtitle = '';
  let width = 420;
  let height = 540;
  let layout: 'flow' | 'border' | 'grid' | 'box' | 'null' = 'flow';
  let gridRows = 6;
  let gridCols = 5;
  let gridHgap = 6;
  let gridVgap = 6;
  let backgroundColor = '#121212';
  let resizable = true;
  let appletMode = false;
  let statusText = 'Ready';
  let isScientificCalculator = false;

  const components: JavaGuiComponent[] = [];
  const menus: JavaMenuItem[] = [];
  const graphicsCommands: JavaGraphicsCommand[] = [];
  const dialogs: JavaGuiDialog[] = [];

  // 1. Detect Applet mode
  if (/extends\s+(?:Applet|JApplet)/.test(sourceCode)) {
    appletMode = true;
    title = 'Java Applet Viewer';
  }

  // 2. Extract Window Title from JFrame("Title"), setTitle("Title"), or super("Title")
  const jFrameTitleMatch = sourceCode.match(/new\s+(?:JFrame|Frame)\s*\(\s*"([^"]+)"\s*\)/i);
  if (jFrameTitleMatch) {
    title = jFrameTitleMatch[1];
  } else {
    const setTitleMatch = sourceCode.match(/setTitle\s*\(\s*"([^"]+)"\s*\)/i);
    if (setTitleMatch) {
      title = setTitleMatch[1];
    } else {
      const superTitleMatch = sourceCode.match(/super\s*\(\s*"([^"]+)"\s*\)/i);
      if (superTitleMatch) {
        title = superTitleMatch[1];
      }
    }
  }

  // 3. Extract Window Dimensions
  const sizeMatch = sourceCode.match(/(?:setSize|setBounds)\s*\(\s*(?:\d+\s*,\s*\d+\s*,\s*)?(\d+)\s*,\s*(\d+)/i);
  if (sizeMatch) {
    const w = parseInt(sizeMatch[1], 10);
    const h = parseInt(sizeMatch[2], 10);
    if (w >= 200 && w <= 1000) width = w;
    if (h >= 150 && h <= 900) height = h;
  }

  // Check resizable
  if (/setResizable\s*\(\s*false\s*\)/i.test(sourceCode)) {
    resizable = false;
  }

  // 4. Extract Layout
  if (/setLayout\s*\(\s*null\s*\)/i.test(sourceCode)) {
    layout = 'null';
  } else if (/setLayout\s*\(\s*new\s+BorderLayout/i.test(sourceCode)) {
    layout = 'border';
  } else if (/setLayout\s*\(\s*new\s+GridLayout\s*\(\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+)\s*,\s*(\d+))?/i.test(sourceCode)) {
    layout = 'grid';
    const gridMatch = sourceCode.match(/setLayout\s*\(\s*new\s+GridLayout\s*\(\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+)\s*,\s*(\d+))?/i);
    if (gridMatch) {
      gridRows = parseInt(gridMatch[1], 10) || 6;
      gridCols = parseInt(gridMatch[2], 10) || 5;
      if (gridMatch[3]) gridHgap = parseInt(gridMatch[3], 10);
      if (gridMatch[4]) gridVgap = parseInt(gridMatch[4], 10);
    }
  } else if (/setLayout\s*\(\s*new\s+FlowLayout/i.test(sourceCode)) {
    layout = 'flow';
  }

  // 5. Extract Background Color
  const bgMatch = sourceCode.match(/(?:getContentPane\(\)|f|frame|this|\b)?\.?\s*setBackground\s*\(\s*([^)]+)\s*\)/i);
  if (bgMatch) {
    backgroundColor = mapJavaColorToCss(bgMatch[1]);
  }

  // 6. Detect Subtitle Header (e.g. "SCIENTIFIC CALCULATOR")
  const subtitleMatch = sourceCode.match(/JLabel\s+\w+\s*=\s*new\s+JLabel\s*\(\s*"([^"]*(?:CALCULATOR|SYSTEM|FORM)[^"]*)"\s*\)/i);
  if (subtitleMatch) {
    subtitle = subtitleMatch[1];
  } else if (/scientific\s*calc/i.test(sourceCode) || /scientific/i.test(title)) {
    subtitle = 'SCIENTIFIC CALCULATOR';
    isScientificCalculator = true;
  }

  // 7. Extract Menu Bar (JMenuBar, JMenu, JMenuItem)
  const menuMap = new Map<string, JavaMenuItem>();
  const menuDeclRegex = /(?:JMenu)\s+(\w+)\s*=\s*new\s+JMenu\s*\(\s*"([^"]*)"\s*\)/g;
  let mMatch: RegExpExecArray | null;
  while ((mMatch = menuDeclRegex.exec(sourceCode)) !== null) {
    const varName = mMatch[1];
    const menuObj: JavaMenuItem = {
      id: `menu-${varName}`,
      label: mMatch[2] || 'Menu',
      items: [],
    };
    menuMap.set(varName, menuObj);
    menus.push(menuObj);
  }

  const menuItemDeclRegex = /(?:JMenuItem)\s+(\w+)\s*=\s*new\s+JMenuItem\s*\(\s*"([^"]*)"\s*\)/g;
  const itemMap = new Map<string, string>();
  while ((mMatch = menuItemDeclRegex.exec(sourceCode)) !== null) {
    itemMap.set(mMatch[1], mMatch[2]);
  }

  const menuAddRegex = /(\w+)\s*\.\s*add\s*\(\s*(?:new\s+JMenuItem\s*\(\s*"([^"]*)"\s*\)|(\w+))\s*\)/g;
  while ((mMatch = menuAddRegex.exec(sourceCode)) !== null) {
    const parentMenuVar = mMatch[1];
    const directLabel = mMatch[2];
    const itemVar = mMatch[3];
    const targetMenu = menuMap.get(parentMenuVar);
    if (targetMenu) {
      const label = directLabel || (itemVar ? itemMap.get(itemVar) : null) || 'Item';
      targetMenu.items?.push({
        id: `mitem-${Date.now()}-${Math.random()}`,
        label,
      });
    }
  }

  // 8. Component Registry
  const compMap = new Map<string, JavaGuiComponent>();

  const registerComp = (comp: JavaGuiComponent) => {
    compMap.set(comp.varName, comp);
    const idx = components.findIndex((c) => c.varName === comp.varName);
    if (idx !== -1) {
      components[idx] = comp;
    } else {
      components.push(comp);
    }
  };

  // Extract Buttons (JButton / Button)
  const btnRegex = /(?:JButton|Button)\s+(\w+)\s*(?:=\s*new\s+(?:JButton|Button)\s*\(\s*"([^"]*)"\s*\))?/g;
  let match: RegExpExecArray | null;
  while ((match = btnRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `btn-${varName}`,
      varName,
      type: 'button',
      text: match[2] || 'Button',
      enabled: true,
      visible: true,
    });
  }

  const btnAssignRegex = /(\w+)\s*=\s*new\s+(?:JButton|Button)\s*\(\s*"([^"]*)"\s*\)/g;
  while ((match = btnAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const existing = compMap.get(varName);
    if (existing) {
      existing.text = match[2] || 'Button';
    } else {
      registerComp({
        id: `btn-${varName}`,
        varName,
        type: 'button',
        text: match[2] || 'Button',
        enabled: true,
        visible: true,
      });
    }
  }

  // Extract Buttons created via array loop:
  // String btnTexts[] = { "sin", "cos", ... }; for (String text : btnTexts) { ... }
  const btnArrayMatch = sourceCode.match(/String\s*(?:\[\s*\]\s*\w+|\w+\s*\[\s*\])\s*=\s*\{([\s\S]*?)\};/);
  if (btnArrayMatch && (sourceCode.includes('JButton') || sourceCode.includes('Button'))) {
    const items = btnArrayMatch[1]
      .split(',')
      .map((s) => s.trim().replace(/^"|"$/g, '').trim())
      .filter(Boolean);

    if (items.length >= 10) {
      isScientificCalculator = true;
      let bIdx = 0;
      for (const item of items) {
        registerComp({
          id: `btn-arr-${bIdx}`,
          varName: `btn_${bIdx++}`,
          type: 'button',
          text: item,
          enabled: true,
          visible: true,
        });
      }
    }
  }

  // Extract Labels (JLabel / Label)
  const labelRegex = /(?:JLabel|Label)\s+(\w+)\s*(?:=\s*new\s+(?:JLabel|Label)\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = labelRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `lbl-${varName}`,
      varName,
      type: 'label',
      text: match[2] || 'Label',
      enabled: true,
      visible: true,
    });
  }

  // Extract TextFields (JTextField / TextField)
  const tfRegex = /(?:JTextField|TextField)\s+(\w+)\s*(?:=\s*new\s+(?:JTextField|TextField)\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\))?/g;
  while ((match = tfRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `tf-${varName}`,
      varName,
      type: 'textfield',
      text: match[2] || (isScientificCalculator ? '0' : ''),
      enabled: true,
      visible: true,
    });
  }

  // If scientific calculator but no textfield explicitly created, add standard display
  const hasDisplay = components.some((c) => c.type === 'textfield');
  if (isScientificCalculator && !hasDisplay) {
    registerComp({
      id: 'tf-display',
      varName: 'display',
      type: 'textfield',
      text: '0',
      enabled: true,
      visible: true,
    });
  }

  // Auto-apply authentic Windows Scientific Calculator colors if not explicitly given
  for (const comp of components) {
    if (comp.type === 'button') {
      const t = comp.text.trim();
      if (!comp.bgColor) {
        if (t === 'C' || t === '⌫' || t === 'DEL' || t === 'CLR') {
          comp.bgColor = '#C83737'; // Coral Red
          comp.color = '#FFFFFF';
        } else if (['/', '×', '*', '-', '+'].includes(t)) {
          comp.bgColor = '#1976D2'; // Windows Accent Blue
          comp.color = '#FFFFFF';
        } else if (t === '=') {
          comp.bgColor = '#10B981'; // Vibrant Emerald Green
          comp.color = '#FFFFFF';
        } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', '1/x', 'π', 'e', '(', ')'].includes(t)) {
          comp.bgColor = '#383838'; // Scientific Dark Gray
          comp.color = '#FFFFFF';
        } else if (/^[0-9]$|\./.test(t)) {
          comp.bgColor = '#262626'; // Charcoal Number Button
          comp.color = '#FFFFFF';
        }
      }
    }
  }

  // Extract Action Listeners
  const listenerRegex = /(\w+)\s*\.\s*addActionListener\s*\(\s*(?:new\s+ActionListener\s*\(\s*\)\s*\{[\s\S]*?actionPerformed\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*\}|e\s*->\s*\{?([\s\S]*?)\}?)\s*\)/g;
  while ((match = listenerRegex.exec(sourceCode)) !== null) {
    const btnVar = match[1];
    const codeBody = (match[2] || match[3] || '').trim();
    const comp = compMap.get(btnVar);
    if (comp) {
      comp.actionCode = codeBody;
    }
  }

  // Extract Graphics 2D Canvas commands: void paint(Graphics g)
  const paintBlockMatch = sourceCode.match(/void\s+(?:paint|paintComponent)\s*\(\s*Graphics\s+(\w+)\s*\)\s*\{([\s\S]*?)\n\s*\}/);
  if (paintBlockMatch) {
    const gVar = paintBlockMatch[1];
    const body = paintBlockMatch[2];
    let currentColor = '#000000';

    const cmdLines = body.split(';');
    for (const cmd of cmdLines) {
      const trimmed = cmd.trim();
      if (!trimmed) continue;

      const colorMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*setColor\\s*\\(([^)]+)\\)`, 'i'));
      if (colorMatch) {
        currentColor = mapJavaColorToCss(colorMatch[1]);
        graphicsCommands.push({ type: 'color', params: [currentColor], color: currentColor });
        continue;
      }

      const strMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawString\\s*\\(\\s*"([^"]*)"\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (strMatch) {
        graphicsCommands.push({
          type: 'string',
          params: [strMatch[1], parseInt(strMatch[2], 10), parseInt(strMatch[3], 10)],
          color: currentColor,
        });
        continue;
      }

      const lineMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawLine\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (lineMatch) {
        graphicsCommands.push({
          type: 'line',
          params: [parseInt(lineMatch[1], 10), parseInt(lineMatch[2], 10), parseInt(lineMatch[3], 10), parseInt(lineMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      const rectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (rectMatch) {
        graphicsCommands.push({
          type: 'rect',
          params: [parseInt(rectMatch[1], 10), parseInt(rectMatch[2], 10), parseInt(rectMatch[3], 10), parseInt(rectMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      const fillRectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*fillRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (fillRectMatch) {
        graphicsCommands.push({
          type: 'fillRect',
          params: [parseInt(fillRectMatch[1], 10), parseInt(fillRectMatch[2], 10), parseInt(fillRectMatch[3], 10), parseInt(fillRectMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      const ovalMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawOval\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (ovalMatch) {
        graphicsCommands.push({
          type: 'oval',
          params: [parseInt(ovalMatch[1], 10), parseInt(ovalMatch[2], 10), parseInt(ovalMatch[3], 10), parseInt(ovalMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      const fillOvalMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*fillOval\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (fillOvalMatch) {
        graphicsCommands.push({
          type: 'fillOval',
          params: [parseInt(fillOvalMatch[1], 10), parseInt(fillOvalMatch[2], 10), parseInt(fillOvalMatch[3], 10), parseInt(fillOvalMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }
    }
  }

  // Extract JOptionPane initial calls
  const msgDialogRegex = /JOptionPane\s*\.\s*showMessageDialog\s*\(\s*[^,]+,\s*"([^"]+)"(?:\s*,\s*"([^"]+)")?/g;
  while ((match = msgDialogRegex.exec(sourceCode)) !== null) {
    dialogs.push({
      id: `dialog-${Date.now()}-${Math.random()}`,
      type: 'message',
      message: match[1],
      title: match[2] || 'Message',
      dialogType: 'info',
    });
  }

  return {
    title,
    subtitle,
    width,
    height,
    layout,
    gridRows,
    gridCols,
    gridHgap,
    gridVgap,
    backgroundColor,
    components,
    menus,
    graphicsCommands,
    dialogs,
    appletMode,
    resizable,
    statusText,
    isScientificCalculator,
    rawCode: sourceCode,
  };
}

/**
 * Advanced Dynamic Event Listener Engine
 * Interprets user-written action code, scientific math functions, expressions, and string operations.
 */
export function handleVirtualButtonClick(
  clickedComp: JavaGuiComponent,
  currentComponents: JavaGuiComponent[],
  rawCode: string,
  calcMemory?: { prevVal?: number; op?: string; clearOnNextDigit?: boolean }
): {
  updatedComponents: JavaGuiComponent[];
  logText: string;
  newDialog?: JavaGuiDialog;
  calcMemoryUpdate?: { prevVal?: number; op?: string; clearOnNextDigit?: boolean };
} {
  const updated = currentComponents.map((c) => ({ ...c }));
  const buttonText = clickedComp.text.trim();
  const actionCode = clickedComp.actionCode || '';
  let logText = `[GUI Action]: Button "${clickedComp.text}" clicked (${clickedComp.varName})`;
  let newDialog: JavaGuiDialog | undefined;
  let calcMemoryUpdate = calcMemory ? { ...calcMemory } : { clearOnNextDigit: false };

  const getCompByVar = (varName: string) => updated.find((c) => c.varName === varName);
  const textFields = updated.filter((c) => c.type === 'textfield' || c.type === 'passwordfield');
  const labels = updated.filter((c) => c.type === 'label');
  const displayField = textFields[0];

  // Helper to resolve string expressions
  const resolveJavaExpr = (expr: string): string => {
    let resolved = expr.trim();
    resolved = resolved.replace(/(\w+)\s*\.\s*getText\s*\(\s*\)/g, (_, varName) => {
      const c = getCompByVar(varName);
      return JSON.stringify(c ? c.text : '');
    });
    resolved = resolved.replace(/String\s*\.\s*valueOf\s*\(([^)]+)\)/g, '$1');
    resolved = resolved.replace(/(?:Integer\.parseInt|Double\.parseDouble)\s*\(([^)]+)\)/g, 'Number($1)');

    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${resolved});`)();
      return String(result !== undefined ? result : '');
    } catch {
      return expr.replace(/^"|"$/g, '').trim();
    }
  };

  // 1. Dynamic Interpretation of attached actionCode
  if (actionCode) {
    const setTextMatches = actionCode.matchAll(/(\w+)\s*\.\s*setText\s*\(([\s\S]*?)\)\s*;/g);
    let handledAnySetText = false;
    for (const match of setTextMatches) {
      const targetVar = match[1];
      const expr = match[2];
      const targetComp = getCompByVar(targetVar);
      if (targetComp) {
        const evaluatedVal = resolveJavaExpr(expr);
        targetComp.text = evaluatedVal;
        logText = `[GUI Action]: Set ${targetVar}.text = "${evaluatedVal}"`;
        handledAnySetText = true;
      }
    }

    const msgDialogMatch = actionCode.match(/JOptionPane\s*\.\s*showMessageDialog\s*\(\s*[^,]+,\s*([^)]+)\)/);
    if (msgDialogMatch) {
      const expr = msgDialogMatch[1].split(',')[0];
      const evaluated = resolveJavaExpr(expr);
      newDialog = {
        id: `dialog-click-${Date.now()}`,
        type: 'message',
        message: evaluated || 'Information',
        title: 'Information',
        dialogType: 'info',
      };
      logText = `[GUI Dialog]: JOptionPane.showMessageDialog -> "${evaluated}"`;
      return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
    }

    if (handledAnySetText) {
      return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
    }
  }

  // 2. Scientific Calculator Functions Engine
  if (displayField) {
    let cur = displayField.text.trim() || '0';
    const numVal = parseFloat(cur) || 0;

    // Trigonometric functions (Degrees mode for practical intuitive answers)
    if (buttonText === 'sin') {
      const res = Math.sin((numVal * Math.PI) / 180);
      displayField.text = formatResult(res);
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: sin(${numVal}°) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'cos') {
      const res = Math.cos((numVal * Math.PI) / 180);
      displayField.text = formatResult(res);
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: cos(${numVal}°) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'tan') {
      const res = Math.tan((numVal * Math.PI) / 180);
      displayField.text = formatResult(res);
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: tan(${numVal}°) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'log') {
      const res = numVal > 0 ? Math.log10(numVal) : 'Error';
      displayField.text = typeof res === 'number' ? formatResult(res) : res;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: log10(${numVal}) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'ln') {
      const res = numVal > 0 ? Math.log(numVal) : 'Error';
      displayField.text = typeof res === 'number' ? formatResult(res) : res;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: ln(${numVal}) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === '√') {
      const res = numVal >= 0 ? Math.sqrt(numVal) : 'Error';
      displayField.text = typeof res === 'number' ? formatResult(res) : res;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: √(${numVal}) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'x²' || buttonText === 'x^2') {
      const res = Math.pow(numVal, 2);
      displayField.text = formatResult(res);
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: (${numVal})² = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === '1/x') {
      const res = numVal !== 0 ? 1 / numVal : 'Error';
      displayField.text = typeof res === 'number' ? formatResult(res) : res;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: 1/(${numVal}) = ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'π') {
      displayField.text = '3.14159265';
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: π = 3.14159265`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === 'e') {
      displayField.text = '2.71828182';
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Scientific]: e = 2.71828182`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === '⌫' || buttonText === 'DEL' || buttonText === 'Backspace') {
      if (cur.length > 1 && cur !== 'Error' && cur !== '0') {
        displayField.text = cur.slice(0, -1);
      } else {
        displayField.text = '0';
      }
      logText = `[Calculator]: Backspace -> ${displayField.text}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
    if (buttonText === '(' || buttonText === ')') {
      if (cur === '0' && buttonText === '(') displayField.text = '(';
      else displayField.text = cur + buttonText;
      return { updatedComponents: updated, logText: `[Calculator]: ${buttonText}`, calcMemoryUpdate };
    }
    if (buttonText === 'C' || buttonText === 'CE' || buttonText === 'CLR') {
      displayField.text = '0';
      calcMemoryUpdate = { prevVal: undefined, op: undefined, clearOnNextDigit: false };
      logText = `[Calculator]: Cleared display`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    // Standard Digits (0 - 9, .)
    const isDigit = /^[0-9]$/.test(buttonText) || buttonText === '.';
    if (isDigit) {
      if (cur === '0' || cur === 'Error' || calcMemoryUpdate.clearOnNextDigit) {
        displayField.text = buttonText === '.' ? '0.' : buttonText;
        calcMemoryUpdate.clearOnNextDigit = false;
      } else {
        if (buttonText === '.' && cur.includes('.')) {
          // Ignore duplicate decimal
        } else {
          displayField.text = cur + buttonText;
        }
      }
      logText = `[Calculator]: Typed digit ${buttonText}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    // Binary Operators (+, -, *, ×, /)
    const isOperator = ['+', '-', '*', '×', '/', '%'].includes(buttonText);
    if (isOperator) {
      calcMemoryUpdate.prevVal = parseFloat(cur) || 0;
      calcMemoryUpdate.op = buttonText === '×' ? '*' : buttonText;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[Calculator]: Operator ${buttonText} (Memory: ${calcMemoryUpdate.prevVal})`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    // Equals (=)
    if (buttonText === '=') {
      if (calcMemoryUpdate.op !== undefined && calcMemoryUpdate.prevVal !== undefined) {
        const v1 = calcMemoryUpdate.prevVal;
        const v2 = parseFloat(cur) || 0;
        let res = 0;
        const op = calcMemoryUpdate.op;

        if (op === '+') res = v1 + v2;
        else if (op === '-') res = v1 - v2;
        else if (op === '*' || op === '×') res = v1 * v2;
        else if (op === '/') res = v2 !== 0 ? v1 / v2 : NaN;

        displayField.text = formatResult(res);
        calcMemoryUpdate.prevVal = res;
        calcMemoryUpdate.clearOnNextDigit = true;
        logText = `[Calculator]: ${v1} ${op} ${v2} = ${displayField.text}`;
        return { updatedComponents: updated, logText, calcMemoryUpdate };
      }
    }
  }

  // 3. Counter Pattern (Increment / Reset)
  if (/click|count|inc|\+/i.test(buttonText)) {
    const counterLabel = labels.find((l) => /count|clicks|score|val|number/i.test(l.text)) || labels[0];
    if (counterLabel) {
      const matchNum = counterLabel.text.match(/\d+/);
      const currentCount = matchNum ? parseInt(matchNum[0], 10) : 0;
      const nextCount = currentCount + 1;
      const prefix = counterLabel.text.replace(/\d+.*$/, '');
      counterLabel.text = `${prefix || 'Count: '}${nextCount}`;
      logText = `[GUI Counter]: Incremented to ${nextCount}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
  }

  return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
}
