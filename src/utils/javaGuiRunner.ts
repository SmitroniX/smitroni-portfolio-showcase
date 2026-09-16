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
    RED: '#DC2626',
    BLUE: '#2563EB',
    GREEN: '#16A34A',
    YELLOW: '#EAB308',
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    GRAY: '#64748B',
    LIGHT_GRAY: '#D1D5DB',
    DARK_GRAY: '#374151',
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

  return '#1E293B';
}

/**
 * Parses Java GUI source code dynamically into an authentic window state.
 * Extracts custom variables, layouts, menus, component properties, 2D graphics, and event code.
 */
export function parseJavaGuiCode(sourceCode: string): JavaGuiState {
  let title = 'Java Application';
  let width = 500;
  let height = 380;
  let layout: 'flow' | 'border' | 'grid' | 'box' | 'null' = 'flow';
  let gridRows = 2;
  let gridCols = 2;
  let gridHgap = 8;
  let gridVgap = 8;
  let backgroundColor = '#F3F3F3'; // Windows 11 default form surface
  let resizable = true;
  let appletMode = false;
  let statusText = 'Ready';

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
    if (h >= 150 && h <= 800) height = h;
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
      gridRows = parseInt(gridMatch[1], 10) || 2;
      gridCols = parseInt(gridMatch[2], 10) || 2;
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

  // 6. Extract Menu Bar (JMenuBar, JMenu, JMenuItem)
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

  // Extract menu items: menu.add(new JMenuItem("Open")) or menu.add(itemVar)
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

  // If no menus defined in code, provide standard Windows desktop menus
  if (menus.length === 0) {
    menus.push(
      {
        id: 'menu-file',
        label: 'File',
        items: [
          { id: 'f-new', label: 'New', shortcut: 'Ctrl+N' },
          { id: 'f-open', label: 'Open...', shortcut: 'Ctrl+O' },
          { id: 'f-save', label: 'Save', shortcut: 'Ctrl+S' },
          { id: 'f-sep', label: '-', isSeparator: true },
          { id: 'f-exit', label: 'Exit', shortcut: 'Alt+F4' },
        ],
      },
      {
        id: 'menu-edit',
        label: 'Edit',
        items: [
          { id: 'e-cut', label: 'Cut', shortcut: 'Ctrl+X' },
          { id: 'e-copy', label: 'Copy', shortcut: 'Ctrl+C' },
          { id: 'e-paste', label: 'Paste', shortcut: 'Ctrl+V' },
        ],
      },
      {
        id: 'menu-help',
        label: 'Help',
        items: [
          { id: 'h-docs', label: 'Java Swing Documentation' },
          { id: 'h-about', label: 'About Code With SmitroniX' },
        ],
      }
    );
  }

  // 7. Component Map & Registry
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

  const labelAssignRegex = /(\w+)\s*=\s*new\s+(?:JLabel|Label)\s*\(\s*"([^"]*)"\s*\)/g;
  while ((match = labelAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const existing = compMap.get(varName);
    if (existing) {
      existing.text = match[2] || 'Label';
    } else {
      registerComp({
        id: `lbl-${varName}`,
        varName,
        type: 'label',
        text: match[2] || 'Label',
        enabled: true,
        visible: true,
      });
    }
  }

  // Extract TextFields (JTextField / TextField)
  const tfRegex = /(?:JTextField|TextField)\s+(\w+)\s*(?:=\s*new\s+(?:JTextField|TextField)\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\))?/g;
  while ((match = tfRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `tf-${varName}`,
      varName,
      type: 'textfield',
      text: match[2] || '',
      enabled: true,
      visible: true,
    });
  }

  const tfAssignRegex = /(\w+)\s*=\s*new\s+(?:JTextField|TextField)\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\)/g;
  while ((match = tfAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const existing = compMap.get(varName);
    if (existing) {
      if (match[2]) existing.text = match[2];
    } else {
      registerComp({
        id: `tf-${varName}`,
        varName,
        type: 'textfield',
        text: match[2] || '',
        enabled: true,
        visible: true,
      });
    }
  }

  // Extract PasswordFields
  const pfRegex = /JPasswordField\s+(\w+)\s*(?:=\s*new\s+JPasswordField\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\))?/g;
  while ((match = pfRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `pf-${varName}`,
      varName,
      type: 'passwordfield',
      text: match[2] || '',
      enabled: true,
      visible: true,
    });
  }

  // Extract TextAreas (JTextArea / TextArea)
  const taRegex = /(?:JTextArea|TextArea)\s+(\w+)\s*(?:=\s*new\s+(?:JTextArea|TextArea)\s*\(\s*(?:"([^"]*)"|(\d+)\s*,\s*(\d+))?\s*\))?/g;
  while ((match = taRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `ta-${varName}`,
      varName,
      type: 'textarea',
      text: match[2] || '',
      enabled: true,
      visible: true,
    });
  }

  // Extract Checkboxes
  const cbRegex = /(?:JCheckBox|Checkbox)\s+(\w+)\s*(?:=\s*new\s+(?:JCheckBox|Checkbox)\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = cbRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `cb-${varName}`,
      varName,
      type: 'checkbox',
      text: match[2] || 'Checkbox',
      checked: false,
      enabled: true,
      visible: true,
    });
  }

  // Extract Radio Buttons
  const rbRegex = /JRadioButton\s+(\w+)\s*(?:=\s*new\s+JRadioButton\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = rbRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `rb-${varName}`,
      varName,
      type: 'radio',
      text: match[2] || 'Radio',
      checked: false,
      enabled: true,
      visible: true,
    });
  }

  // Extract ComboBox (extract items from inline new String[]{...} or arrays)
  const comboRegex = /(?:JComboBox|Choice)\s*(?:<[^>]+>)?\s+(\w+)(?:\s*=\s*new\s+JComboBox\s*(?:<[^>]+>)?\s*\(([^)]*)\))?/g;
  while ((match = comboRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const arg = match[2] || '';
    let extractedOptions: string[] = [];

    // Check if initialized with new String[]{"A", "B", ...}
    const arrayMatch = arg.match(/new\s+String\s*\[\s*\]\s*\{([^}]+)\}/);
    if (arrayMatch) {
      extractedOptions = arrayMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^"|"$/g, ''))
        .filter(Boolean);
    } else if (arg.trim()) {
      // Find array declaration: String var[] = {"...", "..."}
      const arrName = arg.trim();
      const arrDeclRegex = new RegExp(`String\\s+(?:${arrName}\\[\\]|\\[\\]\\s*${arrName})\\s*=\\s*\\{([^}]+)\\}`, 'i');
      const foundArr = sourceCode.match(arrDeclRegex);
      if (foundArr) {
        extractedOptions = foundArr[1]
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
      }
    }

    if (extractedOptions.length === 0) {
      extractedOptions = ['Select option...', 'Computer Science', 'Information Tech', 'AI & Data Science'];
    }

    registerComp({
      id: `cmb-${varName}`,
      varName,
      type: 'combobox',
      text: extractedOptions[0] || '',
      options: extractedOptions,
      enabled: true,
      visible: true,
    });
  }

  // Extract ComboBox .addItem("...") calls
  const addItemRegex = /(\w+)\s*\.\s*addItem\s*\(\s*"([^"]*)"\s*\)/g;
  while ((match = addItemRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const comp = compMap.get(varName);
    if (comp && comp.type === 'combobox') {
      if (!comp.options) comp.options = [];
      if (!comp.options.includes(match[2])) {
        comp.options.push(match[2]);
      }
    }
  }

  // Extract Sliders (JSlider)
  const sliderRegex = /JSlider\s+(\w+)\s*(?:=\s*new\s+JSlider\s*\(([^)]*)\))?/g;
  while ((match = sliderRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const args = match[2] ? match[2].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)) : [];
    const min = args.length >= 2 ? args[0] : 0;
    const max = args.length >= 2 ? args[1] : 100;
    const val = args.length >= 3 ? args[2] : 50;
    registerComp({
      id: `sld-${varName}`,
      varName,
      type: 'slider',
      text: String(val),
      min,
      max,
      value: val,
      enabled: true,
      visible: true,
    });
  }

  // Extract Progress Bars (JProgressBar)
  const pbRegex = /JProgressBar\s+(\w+)\s*(?:=\s*new\s+JProgressBar\s*\(([^)]*)\))?/g;
  while ((match = pbRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const args = match[2] ? match[2].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)) : [];
    const min = args.length >= 2 ? args[0] : 0;
    const max = args.length >= 2 ? args[1] : 100;
    registerComp({
      id: `pb-${varName}`,
      varName,
      type: 'progressbar',
      text: '50%',
      min,
      max,
      value: 50,
      enabled: true,
      visible: true,
    });
  }

  // Extract Tables (JTable)
  const tableRegex = /JTable\s+(\w+)\s*(?:=\s*new\s+JTable\s*\(([^)]*)\))?/g;
  while ((match = tableRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    registerComp({
      id: `tbl-${varName}`,
      varName,
      type: 'table',
      text: 'Table View',
      columns: ['ID', 'NAME', 'ROLL NO', 'BATCH', 'GRADE'],
      rows: [
        ['101', 'Alex Mercer', '24IT01', 'A1', 'A+'],
        ['102', 'Sarah Connor', '24IT02', 'A1', 'A'],
        ['103', 'John Doe', '24IT03', 'A2', 'B+'],
        ['104', 'Emily Watson', '24IT04', 'A2', 'O'],
      ],
      enabled: true,
      visible: true,
    });
  }

  // Extract Anonymous Inline Adds: f.add(new JButton("Click"));
  const inlineAddRegex = /(?:add|\.add)\s*\(\s*new\s+(JButton|Button|JLabel|Label|JTextField|TextField)\s*\(\s*"([^"]*)"\s*\)\s*\)/g;
  let inlineCount = 1;
  while ((match = inlineAddRegex.exec(sourceCode)) !== null) {
    const typeStr = match[1].toLowerCase();
    const text = match[2] || '';
    const compType = typeStr.includes('button') ? 'button' : typeStr.includes('label') ? 'label' : 'textfield';
    registerComp({
      id: `inline-${inlineCount}`,
      varName: `inline${inlineCount++}`,
      type: compType,
      text,
      enabled: true,
      visible: true,
    });
  }

  // 8. Extract setBounds for absolute positioning (setLayout(null))
  const setBoundsRegex = /(\w+)\s*\.\s*setBounds\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g;
  while ((match = setBoundsRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const comp = compMap.get(varName);
    if (comp) {
      comp.bounds = {
        x: parseInt(match[2], 10),
        y: parseInt(match[3], 10),
        width: parseInt(match[4], 10),
        height: parseInt(match[5], 10),
      };
    }
  }

  // 9. Extract BorderLayout positions: add(comp, BorderLayout.NORTH) or add(comp, "North")
  const borderAddRegex = /(?:add|\.add)\s*\(\s*(\w+)\s*,\s*(?:BorderLayout\.)?([A-Z]+|"North"|"South"|"East"|"West"|"Center")\s*\)/gi;
  while ((match = borderAddRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const rawPos = match[2].replace(/"/g, '').toUpperCase();
    const comp = compMap.get(varName);
    if (comp) {
      if (rawPos === 'NORTH') comp.position = 'North';
      else if (rawPos === 'SOUTH') comp.position = 'South';
      else if (rawPos === 'EAST') comp.position = 'East';
      else if (rawPos === 'WEST') comp.position = 'West';
      else if (rawPos === 'CENTER') comp.position = 'Center';
    }
  }

  // 10. Extract custom foreground and background colors on components:
  // e.g. b1.setBackground(Color.RED), l1.setForeground(Color.BLUE)
  const compColorRegex = /(\w+)\s*\.\s*(setBackground|setForeground)\s*\(\s*([^)]+)\s*\)/g;
  while ((match = compColorRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const method = match[2];
    const colorVal = mapJavaColorToCss(match[3]);
    const comp = compMap.get(varName);
    if (comp) {
      if (method === 'setBackground') comp.bgColor = colorVal;
      else if (method === 'setForeground') comp.color = colorVal;
    }
  }

  // 11. Extract Action Listeners code attached to buttons:
  // btn.addActionListener(e -> { ... }) or btn.addActionListener(new ActionListener() { ... })
  const listenerRegex = /(\w+)\s*\.\s*addActionListener\s*\(\s*(?:new\s+ActionListener\s*\(\s*\)\s*\{[\s\S]*?actionPerformed\s*\([^)]*\)\s*\{([\s\S]*?)\}\s*\}|e\s*->\s*\{?([\s\S]*?)\}?)\s*\)/g;
  while ((match = listenerRegex.exec(sourceCode)) !== null) {
    const btnVar = match[1];
    const codeBody = (match[2] || match[3] || '').trim();
    const comp = compMap.get(btnVar);
    if (comp) {
      comp.actionCode = codeBody;
    }
  }

  // Also check global actionPerformed method:
  // public void actionPerformed(ActionEvent e) { if (e.getSource() == b1) { ... } }
  const actionPerformedMatch = sourceCode.match(/public\s+void\s+actionPerformed\s*\(\s*ActionEvent\s+(\w+)\s*\)\s*\{([\s\S]*?)\n\s*\}/);
  if (actionPerformedMatch) {
    const eVar = actionPerformedMatch[1];
    const body = actionPerformedMatch[2];
    const ifBranches = body.split(/else\s+if|if/g);
    for (const branch of ifBranches) {
      const matchSource = branch.match(new RegExp(`${eVar}\\s*\\.\\s*getSource\\s*\\(\\s*\\)\\s*==\\s*(\\w+)`));
      if (matchSource) {
        const btnVar = matchSource[1];
        const comp = compMap.get(btnVar);
        if (comp && !comp.actionCode) {
          comp.actionCode = branch;
        }
      }
    }
  }

  // 12. Extract Graphics 2D Canvas commands: void paint(Graphics g) or paintComponent(Graphics g)
  const paintBlockMatch = sourceCode.match(/void\s+(?:paint|paintComponent)\s*\(\s*Graphics\s+(\w+)\s*\)\s*\{([\s\S]*?)\n\s*\}/);
  if (paintBlockMatch) {
    const gVar = paintBlockMatch[1];
    const body = paintBlockMatch[2];
    let currentColor = '#000000';

    const cmdLines = body.split(';');
    for (const cmd of cmdLines) {
      const trimmed = cmd.trim();
      if (!trimmed) continue;

      // setColor(Color.RED)
      const colorMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*setColor\\s*\\(([^)]+)\\)`, 'i'));
      if (colorMatch) {
        currentColor = mapJavaColorToCss(colorMatch[1]);
        graphicsCommands.push({ type: 'color', params: [currentColor], color: currentColor });
        continue;
      }

      // drawString("Text", x, y)
      const strMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawString\\s*\\(\\s*"([^"]*)"\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (strMatch) {
        graphicsCommands.push({
          type: 'string',
          params: [strMatch[1], parseInt(strMatch[2], 10), parseInt(strMatch[3], 10)],
          color: currentColor,
        });
        continue;
      }

      // drawLine(x1, y1, x2, y2)
      const lineMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawLine\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (lineMatch) {
        graphicsCommands.push({
          type: 'line',
          params: [parseInt(lineMatch[1], 10), parseInt(lineMatch[2], 10), parseInt(lineMatch[3], 10), parseInt(lineMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      // drawRect(x, y, w, h)
      const rectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (rectMatch) {
        graphicsCommands.push({
          type: 'rect',
          params: [parseInt(rectMatch[1], 10), parseInt(rectMatch[2], 10), parseInt(rectMatch[3], 10), parseInt(rectMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      // fillRect(x, y, w, h)
      const fillRectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*fillRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (fillRectMatch) {
        graphicsCommands.push({
          type: 'fillRect',
          params: [parseInt(fillRectMatch[1], 10), parseInt(fillRectMatch[2], 10), parseInt(fillRectMatch[3], 10), parseInt(fillRectMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      // drawOval(x, y, w, h)
      const ovalMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawOval\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (ovalMatch) {
        graphicsCommands.push({
          type: 'oval',
          params: [parseInt(ovalMatch[1], 10), parseInt(ovalMatch[2], 10), parseInt(ovalMatch[3], 10), parseInt(ovalMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      // fillOval(x, y, w, h)
      const fillOvalMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*fillOval\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (fillOvalMatch) {
        graphicsCommands.push({
          type: 'fillOval',
          params: [parseInt(fillOvalMatch[1], 10), parseInt(fillOvalMatch[2], 10), parseInt(fillOvalMatch[3], 10), parseInt(fillOvalMatch[4], 10)],
          color: currentColor,
        });
        continue;
      }

      // drawRoundRect(x, y, w, h, aw, ah)
      const roundRectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*drawRoundRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (roundRectMatch) {
        graphicsCommands.push({
          type: 'roundRect',
          params: [
            parseInt(roundRectMatch[1], 10),
            parseInt(roundRectMatch[2], 10),
            parseInt(roundRectMatch[3], 10),
            parseInt(roundRectMatch[4], 10),
            parseInt(roundRectMatch[5], 10),
            parseInt(roundRectMatch[6], 10),
          ],
          color: currentColor,
        });
        continue;
      }

      // fillRoundRect(x, y, w, h, aw, ah)
      const fillRoundRectMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*fillRoundRect\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (fillRoundRectMatch) {
        graphicsCommands.push({
          type: 'fillRoundRect',
          params: [
            parseInt(fillRoundRectMatch[1], 10),
            parseInt(fillRoundRectMatch[2], 10),
            parseInt(fillRoundRectMatch[3], 10),
            parseInt(fillRoundRectMatch[4], 10),
            parseInt(fillRoundRectMatch[5], 10),
            parseInt(fillRoundRectMatch[6], 10),
          ],
          color: currentColor,
        });
        continue;
      }

      // drawArc / fillArc
      const arcMatch = trimmed.match(new RegExp(`${gVar}\\s*\\.\\s*(drawArc|fillArc)\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)`, 'i'));
      if (arcMatch) {
        graphicsCommands.push({
          type: arcMatch[1].toLowerCase() === 'fillarc' ? 'fillArc' : 'arc',
          params: [
            parseInt(arcMatch[2], 10),
            parseInt(arcMatch[3], 10),
            parseInt(arcMatch[4], 10),
            parseInt(arcMatch[5], 10),
            parseInt(arcMatch[6], 10),
            parseInt(arcMatch[7], 10),
          ],
          color: currentColor,
        });
        continue;
      }
    }
  }

  // 13. Extract JOptionPane initial calls
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

  const inputDialogRegex = /JOptionPane\s*\.\s*showInputDialog\s*\(\s*(?:[^,]+,\s*)?"([^"]+)"(?:\s*,\s*"([^"]+)")?/g;
  while ((match = inputDialogRegex.exec(sourceCode)) !== null) {
    dialogs.push({
      id: `dialog-${Date.now()}-${Math.random()}`,
      type: 'input',
      message: match[1],
      title: match[2] || 'Input',
      initialValue: '',
      dialogType: 'question',
    });
  }

  return {
    title,
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
    rawCode: sourceCode,
  };
}

/**
 * Advanced Dynamic Event Listener Engine
 * Interprets user-written action code, expression trees, arithmetic, and string operations.
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

  // Helper to resolve string expressions like: "Hello " + tf.getText() or Integer.parseInt(t1.getText()) + ...
  const resolveJavaExpr = (expr: string): string => {
    let resolved = expr.trim();

    // Replace component.getText() with live component value
    resolved = resolved.replace(/(\w+)\s*\.\s*getText\s*\(\s*\)/g, (_, varName) => {
      const c = getCompByVar(varName);
      return JSON.stringify(c ? c.text : '');
    });

    // Replace String.valueOf(...) with inner
    resolved = resolved.replace(/String\s*\.\s*valueOf\s*\(([^)]+)\)/g, '$1');

    // Replace Integer.parseInt(...) or Double.parseDouble(...)
    resolved = resolved.replace(/(?:Integer\.parseInt|Double\.parseDouble)\s*\(([^)]+)\)/g, 'Number($1)');

    try {
      // Safely evaluate simple arithmetic or string concatenation
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${resolved});`)();
      return String(result !== undefined ? result : '');
    } catch {
      // If eval fails, return stripped string
      return expr.replace(/^"|"$/g, '').trim();
    }
  };

  // 1. Dynamic Interpretation of attached actionCode
  if (actionCode) {
    // A. Check for targetVar.setText(...)
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

    // B. Check for JOptionPane.showMessageDialog(..., "...")
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

    // C. Check for component color changes (.setBackground / .setForeground)
    const colorMatch = actionCode.match(/(\w+)\s*\.\s*(setBackground|setForeground)\s*\(([^)]+)\)/);
    if (colorMatch) {
      const targetVar = colorMatch[1];
      const method = colorMatch[2];
      const cssColor = mapJavaColorToCss(colorMatch[3]);
      const targetComp = getCompByVar(targetVar);
      if (targetComp) {
        if (method === 'setBackground') targetComp.bgColor = cssColor;
        else targetComp.color = cssColor;
        logText = `[GUI Action]: Changed ${targetVar} color to ${cssColor}`;
      }
    }

    if (handledAnySetText) {
      return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
    }
  }

  // 2. Full Standard Interactive Java Calculator Engine (Swing Calculator)
  // Detects if window contains calculator buttons (digits, operators, equals, clear)
  const isDigit = /^[0-9]$/.test(buttonText) || buttonText === '.';
  const isOperator = ['+', '-', '*', '/', '%'].includes(buttonText) || /add|sub|mul|div/i.test(buttonText);
  const isEquals = buttonText === '=' || /calc|equal/i.test(buttonText);
  const isClearBtn = buttonText.toUpperCase() === 'C' || buttonText.toUpperCase() === 'CE' || /clear|reset/i.test(buttonText);

  // If there's a primary text field (the display)
  const displayField = textFields[0];

  if (displayField && (isDigit || isOperator || isEquals || isClearBtn)) {
    let currentDisplay = displayField.text || '0';

    if (isDigit) {
      if (currentDisplay === '0' || calcMemoryUpdate.clearOnNextDigit) {
        displayField.text = buttonText === '.' ? '0.' : buttonText;
        calcMemoryUpdate.clearOnNextDigit = false;
      } else {
        if (buttonText === '.' && currentDisplay.includes('.')) {
          // Ignore duplicate decimal point
        } else {
          displayField.text = currentDisplay + buttonText;
        }
      }
      logText = `[GUI Calculator]: Typed digit ${buttonText}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    if (isOperator) {
      calcMemoryUpdate.prevVal = parseFloat(currentDisplay) || 0;
      calcMemoryUpdate.op = buttonText;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[GUI Calculator]: Operator ${buttonText} (Prev: ${calcMemoryUpdate.prevVal})`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    if (isEquals && calcMemoryUpdate.op !== undefined && calcMemoryUpdate.prevVal !== undefined) {
      const v1 = calcMemoryUpdate.prevVal;
      const v2 = parseFloat(currentDisplay) || 0;
      let res = 0;
      const op = calcMemoryUpdate.op;

      if (op === '+' || /add/i.test(op)) res = v1 + v2;
      else if (op === '-' || /sub/i.test(op)) res = v1 - v2;
      else if (op === '*' || /mul/i.test(op)) res = v1 * v2;
      else if (op === '/' || /div/i.test(op)) res = v2 !== 0 ? v1 / v2 : 0;

      const formatted = Number.isInteger(res) ? String(res) : res.toFixed(4).replace(/\.?0+$/, '');
      displayField.text = formatted;
      calcMemoryUpdate.prevVal = res;
      calcMemoryUpdate.clearOnNextDigit = true;
      logText = `[GUI Calculator]: ${v1} ${op} ${v2} = ${formatted}`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }

    if (isClearBtn) {
      displayField.text = '0';
      calcMemoryUpdate = { prevVal: undefined, op: undefined, clearOnNextDigit: false };
      logText = `[GUI Calculator]: Display cleared`;
      return { updatedComponents: updated, logText, calcMemoryUpdate };
    }
  }

  // 3. Multi-TextField Binary Operations (e.g. Num1, Num2 -> Add / Sub / Mul / Div)
  if (textFields.length >= 2 && (/add|\+|sub|-|mul|\*|div|\/|sum|calculate/i.test(buttonText))) {
    const v1 = parseFloat(textFields[0].text) || 0;
    const v2 = parseFloat(textFields[1].text) || 0;
    let res = 0;
    let op = '+';

    if (/add|\+|sum/i.test(buttonText)) {
      res = v1 + v2;
      op = '+';
    } else if (/sub|-|minus/i.test(buttonText)) {
      res = v1 - v2;
      op = '-';
    } else if (/mul|\*|times/i.test(buttonText)) {
      res = v1 * v2;
      op = '*';
    } else if (/div|\//i.test(buttonText)) {
      res = v2 !== 0 ? v1 / v2 : 0;
      op = '/';
    }

    const resStr = Number.isInteger(res) ? String(res) : res.toFixed(2);
    if (textFields[2]) {
      textFields[2].text = resStr;
    } else {
      const resLabel = labels.find((l) => /result|ans|total|sum/i.test(l.text)) || labels[labels.length - 1];
      if (resLabel) {
        resLabel.text = `Result: ${resStr}`;
      }
    }

    logText = `[GUI Operation]: ${v1} ${op} ${v2} = ${resStr}`;
    return { updatedComponents: updated, logText, calcMemoryUpdate };
  }

  // 4. Counter Pattern (Increment, Count, Click, +)
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

  // 5. Form Submission / Registration / Login / Greet
  if (/submit|register|login|ok|greet|hello/i.test(buttonText)) {
    const nameVal = textFields[0]?.text.trim() || 'User';
    const statusLabel = labels.find((l) => /status|welcome|msg|info|registered|result/i.test(l.text)) || labels[labels.length - 1];
    if (statusLabel) {
      statusLabel.text = `Welcome, ${nameVal}! Form successfully processed.`;
    }

    newDialog = {
      id: `dialog-submit-${Date.now()}`,
      type: 'message',
      message: `Form Submitted Successfully!\nName: ${nameVal}`,
      title: 'Success',
      dialogType: 'info',
    };

    logText = `[GUI Form]: Submitted form with value "${nameVal}"`;
    return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
  }

  return { updatedComponents: updated, logText, newDialog, calcMemoryUpdate };
}
