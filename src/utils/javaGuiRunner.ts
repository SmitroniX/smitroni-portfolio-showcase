/**
 * Code With SmitroniX - Java GUI (Swing & AWT) Execution Engine
 * Provides browser-based execution for Java Swing, AWT, Applets, and Graphics 2D.
 * Allows university students and developers to run GUI Java programs directly in-browser.
 */

export interface JavaGuiComponent {
  id: string;
  varName: string;
  type: 'button' | 'label' | 'textfield' | 'passwordfield' | 'textarea' | 'checkbox' | 'radio' | 'combobox' | 'canvas';
  text: string;
  bounds?: { x: number; y: number; width: number; height: number };
  position?: 'North' | 'South' | 'East' | 'West' | 'Center';
  checked?: boolean;
  options?: string[];
  color?: string;
  bgColor?: string;
  actionCode?: string;
}

export interface JavaGraphicsCommand {
  type: 'color' | 'line' | 'rect' | 'fillRect' | 'oval' | 'fillOval' | 'roundRect' | 'fillRoundRect' | 'arc' | 'fillArc' | 'string';
  params: (number | string)[];
  color?: string;
}

export interface JavaGuiDialog {
  id: string;
  type: 'message' | 'input' | 'confirm';
  message: string;
  title?: string;
  initialValue?: string;
}

export interface JavaGuiState {
  title: string;
  width: number;
  height: number;
  layout: 'flow' | 'border' | 'grid' | 'null';
  gridRows?: number;
  gridCols?: number;
  backgroundColor: string;
  components: JavaGuiComponent[];
  graphicsCommands: JavaGraphicsCommand[];
  dialogs: JavaGuiDialog[];
  appletMode: boolean;
  rawCode: string;
}

/**
 * Checks if the source code contains Java GUI constructs (Swing, AWT, Applet, Graphics, etc.)
 */
export function isJavaGuiCode(code: string): boolean {
  return /(?:import\s+(?:java\.awt|javax\.swing)|extends\s+(?:JFrame|Frame|Applet|JApplet|JPanel|Canvas)|(?:new\s+(?:JFrame|Frame|JDialog|Dialog)\b)|JOptionPane\s*\.|\b(?:paint|paintComponent)\s*\(\s*Graphics\b|\b(?:JButton|JLabel|JTextField|JTextArea|JCheckBox|JRadioButton|JComboBox|FlowLayout|BorderLayout|GridLayout)\b)/.test(
    code
  );
}

/**
 * Maps Java Color constants or new Color(r,g,b) to CSS colors
 */
export function mapJavaColorToCss(colorExpr: string): string {
  const clean = colorExpr.trim().replace(/^Color\./i, '').toUpperCase();
  const colorMap: Record<string, string> = {
    RED: '#EF4444',
    BLUE: '#3B82F6',
    GREEN: '#10B981',
    YELLOW: '#FACC15',
    BLACK: '#0F172A',
    WHITE: '#FFFFFF',
    GRAY: '#64748B',
    LIGHT_GRAY: '#CBD5E1',
    DARK_GRAY: '#334155',
    PINK: '#EC4899',
    ORANGE: '#F97316',
    CYAN: '#06B6D4',
    MAGENTA: '#D946EF',
  };

  if (colorMap[clean]) {
    return colorMap[clean];
  }

  // Handle new Color(r, g, b)
  const rgbMatch = colorExpr.match(/new\s+Color\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (rgbMatch) {
    return `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`;
  }

  return '#0F172A';
}

/**
 * Parses Java GUI source code and extracts window properties, components, layout,
 * Graphics drawing operations, and JOptionPane triggers.
 */
export function parseJavaGuiCode(sourceCode: string): JavaGuiState {
  let title = 'Java GUI Application';
  let width = 420;
  let height = 340;
  let layout: 'flow' | 'border' | 'grid' | 'null' = 'flow';
  let gridRows = 2;
  let gridCols = 2;
  let backgroundColor = '#F1F5F9';
  const components: JavaGuiComponent[] = [];
  const graphicsCommands: JavaGraphicsCommand[] = [];
  const dialogs: JavaGuiDialog[] = [];
  let appletMode = false;

  const lines = sourceCode.split('\n');

  // 1. Detect Applet mode
  if (/extends\s+(?:Applet|JApplet)/.test(sourceCode)) {
    appletMode = true;
    title = 'Java Applet Viewer';
  }

  // 2. Extract Window Title
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
  const sizeMatch = sourceCode.match(/(?:setSize|setBounds)\s*\(\s*(\d+)\s*,\s*(\d+)/i);
  if (sizeMatch) {
    const w = parseInt(sizeMatch[1], 10);
    const h = parseInt(sizeMatch[2], 10);
    if (w > 150 && w < 900) width = w;
    if (h > 120 && h < 800) height = h;
  }

  // 4. Extract Layout
  if (/setLayout\s*\(\s*null\s*\)/i.test(sourceCode)) {
    layout = 'null';
  } else if (/setLayout\s*\(\s*new\s+BorderLayout/i.test(sourceCode)) {
    layout = 'border';
  } else if (/setLayout\s*\(\s*new\s+GridLayout\s*\(\s*(\d+)\s*,\s*(\d+)/i.test(sourceCode)) {
    layout = 'grid';
    const gridMatch = sourceCode.match(/setLayout\s*\(\s*new\s+GridLayout\s*\(\s*(\d+)\s*,\s*(\d+)/i);
    if (gridMatch) {
      gridRows = parseInt(gridMatch[1], 10) || 2;
      gridCols = parseInt(gridMatch[2], 10) || 2;
    }
  } else if (/setLayout\s*\(\s*new\s+FlowLayout/i.test(sourceCode)) {
    layout = 'flow';
  }

  // 5. Extract Background Color
  const bgMatch = sourceCode.match(/(?:f|frame|this|\b)?\.?\s*setBackground\s*\(\s*([^)]+)\s*\)/i);
  if (bgMatch) {
    backgroundColor = mapJavaColorToCss(bgMatch[1]);
  }

  // 6. Component Declarations & Initializations
  // Map of component variable names to component objects
  const compMap = new Map<string, JavaGuiComponent>();

  const addOrUpdateComp = (comp: JavaGuiComponent) => {
    compMap.set(comp.varName, comp);
    const existingIdx = components.findIndex((c) => c.varName === comp.varName);
    if (existingIdx !== -1) {
      components[existingIdx] = comp;
    } else {
      components.push(comp);
    }
  };

  // Extract Buttons
  const buttonRegex = /(?:JButton|Button)\s+(\w+)\s*(?:=\s*new\s+(?:JButton|Button)\s*\(\s*"([^"]*)"\s*\))?/g;
  let match: RegExpExecArray | null;
  while ((match = buttonRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || 'Button';
    addOrUpdateComp({
      id: `btn-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'button',
      text,
    });
  }

  // Assign Buttons (e.g. b1 = new JButton("Click"))
  const buttonAssignRegex = /(\w+)\s*=\s*new\s+(?:JButton|Button)\s*\(\s*"([^"]*)"\s*\)/g;
  while ((match = buttonAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || 'Button';
    const existing = compMap.get(varName);
    if (existing) {
      existing.text = text;
    } else {
      addOrUpdateComp({
        id: `btn-${varName}-${Date.now()}-${Math.random()}`,
        varName,
        type: 'button',
        text,
      });
    }
  }

  // Extract Labels
  const labelRegex = /(?:JLabel|Label)\s+(\w+)\s*(?:=\s*new\s+(?:JLabel|Label)\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = labelRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || 'Label';
    addOrUpdateComp({
      id: `lbl-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'label',
      text,
    });
  }

  const labelAssignRegex = /(\w+)\s*=\s*new\s+(?:JLabel|Label)\s*\(\s*"([^"]*)"\s*\)/g;
  while ((match = labelAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || 'Label';
    const existing = compMap.get(varName);
    if (existing) {
      existing.text = text;
    } else {
      addOrUpdateComp({
        id: `lbl-${varName}-${Date.now()}-${Math.random()}`,
        varName,
        type: 'label',
        text,
      });
    }
  }

  // Extract TextFields
  const tfRegex = /(?:JTextField|TextField)\s+(\w+)\s*(?:=\s*new\s+(?:JTextField|TextField)\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\))?/g;
  while ((match = tfRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || '';
    addOrUpdateComp({
      id: `tf-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'textfield',
      text,
    });
  }

  const tfAssignRegex = /(\w+)\s*=\s*new\s+(?:JTextField|TextField)\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\)/g;
  while ((match = tfAssignRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    const text = match[2] || '';
    const existing = compMap.get(varName);
    if (existing) {
      if (text) existing.text = text;
    } else {
      addOrUpdateComp({
        id: `tf-${varName}-${Date.now()}-${Math.random()}`,
        varName,
        type: 'textfield',
        text,
      });
    }
  }

  // Extract PasswordFields
  const pfRegex = /JPasswordField\s+(\w+)\s*(?:=\s*new\s+JPasswordField\s*\(\s*(?:"([^"]*)"|(\d+))?\s*\))?/g;
  while ((match = pfRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    addOrUpdateComp({
      id: `pf-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'passwordfield',
      text: match[2] || '',
    });
  }

  // Extract TextAreas
  const taRegex = /(?:JTextArea|TextArea)\s+(\w+)\s*(?:=\s*new\s+(?:JTextArea|TextArea)\s*\(\s*(?:"([^"]*)"|(\d+)\s*,\s*(\d+))?\s*\))?/g;
  while ((match = taRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    addOrUpdateComp({
      id: `ta-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'textarea',
      text: match[2] || '',
    });
  }

  // Extract Checkboxes
  const cbRegex = /(?:JCheckBox|Checkbox)\s+(\w+)\s*(?:=\s*new\s+(?:JCheckBox|Checkbox)\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = cbRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    addOrUpdateComp({
      id: `cb-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'checkbox',
      text: match[2] || 'Checkbox',
      checked: false,
    });
  }

  // Extract Radio Buttons
  const rbRegex = /JRadioButton\s+(\w+)\s*(?:=\s*new\s+JRadioButton\s*\(\s*"([^"]*)"\s*\))?/g;
  while ((match = rbRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    addOrUpdateComp({
      id: `rb-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'radio',
      text: match[2] || 'Radio',
      checked: false,
    });
  }

  // Extract ComboBox / Choice
  const comboRegex = /(?:JComboBox|Choice)\s*(?:<[^>]+>)?\s+(\w+)/g;
  while ((match = comboRegex.exec(sourceCode)) !== null) {
    const varName = match[1];
    addOrUpdateComp({
      id: `cmb-${varName}-${Date.now()}-${Math.random()}`,
      varName,
      type: 'combobox',
      text: '',
      options: ['Select option...', 'Item 1', 'Item 2', 'Item 3'],
    });
  }

  // Extract Anonymous Inline Adds: f.add(new JButton("Click"));
  const inlineAddRegex = /(?:add|\.add)\s*\(\s*new\s+(JButton|Button|JLabel|Label|JTextField|TextField)\s*\(\s*"([^"]*)"\s*\)\s*\)/g;
  let inlineCount = 1;
  while ((match = inlineAddRegex.exec(sourceCode)) !== null) {
    const typeStr = match[1].toLowerCase();
    const text = match[2] || '';
    const compType = typeStr.includes('button') ? 'button' : typeStr.includes('label') ? 'label' : 'textfield';
    addOrUpdateComp({
      id: `inline-${inlineCount}-${Date.now()}`,
      varName: `inline${inlineCount++}`,
      type: compType,
      text,
    });
  }

  // 7. Extract setBounds for absolute positioning
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

  // 8. Extract BorderLayout positions: add(comp, BorderLayout.NORTH) or add(comp, "North")
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

  // 9. Extract Graphics 2D Canvas commands: void paint(Graphics g) or paintComponent(Graphics g)
  const paintBlockMatch = sourceCode.match(/void\s+(?:paint|paintComponent)\s*\(\s*Graphics\s+(\w+)\s*\)\s*\{([\s\S]*?)\n\s*\}/);
  if (paintBlockMatch) {
    const gVar = paintBlockMatch[1];
    const body = paintBlockMatch[2];
    let currentColor = '#0F172A';

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

  // 10. Extract JOptionPane initial calls
  const msgDialogRegex = /JOptionPane\s*\.\s*showMessageDialog\s*\(\s*[^,]+,\s*"([^"]+)"(?:\s*,\s*"([^"]+)")?/g;
  while ((match = msgDialogRegex.exec(sourceCode)) !== null) {
    dialogs.push({
      id: `dialog-${Date.now()}-${Math.random()}`,
      type: 'message',
      message: match[1],
      title: match[2] || 'Message',
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
    });
  }

  return {
    title,
    width,
    height,
    layout,
    gridRows,
    gridCols,
    backgroundColor,
    components,
    graphicsCommands,
    dialogs,
    appletMode,
    rawCode: sourceCode,
  };
}

/**
 * Handles interactive button clicks on the virtual Java GUI window.
 * Evaluates calculator arithmetic, counters, greetings, and label updates.
 */
export function handleVirtualButtonClick(
  clickedComp: JavaGuiComponent,
  currentComponents: JavaGuiComponent[],
  rawCode: string
): { updatedComponents: JavaGuiComponent[]; logText: string; newDialog?: JavaGuiDialog } {
  const updated = currentComponents.map((c) => ({ ...c }));
  const buttonText = clickedComp.text.trim();
  let logText = `[GUI Event]: Button "${clickedComp.text}" clicked (${clickedComp.varName})`;
  let newDialog: JavaGuiDialog | undefined;

  // 1. Calculator Operations (+, -, *, /, Add, Subtract, Multiply, Divide, =, Clear)
  const textFields = updated.filter((c) => c.type === 'textfield');
  const labels = updated.filter((c) => c.type === 'label');

  const isAdd = /add|\+|plus/i.test(buttonText);
  const isSub = /sub|-|minus/i.test(buttonText);
  const isMul = /mul|\*|multiply|times/i.test(buttonText);
  const isDiv = /div|\/|divide/i.test(buttonText);
  const isClear = /clear|reset|c/i.test(buttonText);

  if ((isAdd || isSub || isMul || isDiv || isClear) && textFields.length >= 2) {
    const val1 = parseFloat(textFields[0].text) || 0;
    const val2 = parseFloat(textFields[1].text) || 0;
    let result = 0;
    let opSymbol = '+';

    if (isAdd) {
      result = val1 + val2;
      opSymbol = '+';
    } else if (isSub) {
      result = val1 - val2;
      opSymbol = '-';
    } else if (isMul) {
      result = val1 * val2;
      opSymbol = '*';
    } else if (isDiv) {
      result = val2 !== 0 ? val1 / val2 : 0;
      opSymbol = '/';
    } else if (isClear) {
      textFields[0].text = '';
      textFields[1].text = '';
      if (textFields[2]) textFields[2].text = '';
      logText = `[GUI Calculator]: Cleared inputs`;
      return { updatedComponents: updated, logText };
    }

    // Format result nicely
    const resultStr = Number.isInteger(result) ? String(result) : result.toFixed(2);

    // If there is a 3rd text field (commonly t3 for result)
    if (textFields.length >= 3) {
      textFields[2].text = resultStr;
    } else {
      // Look for a result label
      const resLabel = labels.find((l) => /result|ans|total|output|sum/i.test(l.text)) || labels[labels.length - 1];
      if (resLabel) {
        resLabel.text = `Result: ${resultStr}`;
      }
    }

    logText = `[GUI Calculator]: ${val1} ${opSymbol} ${val2} = ${resultStr}`;
    return { updatedComponents: updated, logText };
  }

  // 2. Counter Pattern (Increment, Count, Click, +)
  if (/click|count|inc|\+/i.test(buttonText)) {
    const counterLabel = labels.find((l) => /count|clicks|score|val|number/i.test(l.text)) || labels[0];
    if (counterLabel) {
      const matchNum = counterLabel.text.match(/\d+/);
      const currentCount = matchNum ? parseInt(matchNum[0], 10) : 0;
      const nextCount = currentCount + 1;
      const prefix = counterLabel.text.replace(/\d+.*$/, '');
      counterLabel.text = `${prefix || 'Count: '}${nextCount}`;
      logText = `[GUI Counter]: Incremented to ${nextCount}`;
      return { updatedComponents: updated, logText };
    }
  }

  // 3. Greeting / Name Input Pattern
  if (/greet|hello|submit|ok|login|enter/i.test(buttonText) && textFields.length >= 1) {
    const inputVal = textFields[0].text.trim() || 'Guest';
    const targetLabel = labels.find((l) => /welcome|hello|greeting|name|user/i.test(l.text)) || labels[labels.length - 1];
    if (targetLabel) {
      targetLabel.text = `Welcome, ${inputVal}!`;
    }

    // Check if code has JOptionPane.showMessageDialog
    if (/JOptionPane\.showMessageDialog/i.test(rawCode)) {
      newDialog = {
        id: `dialog-click-${Date.now()}`,
        type: 'message',
        message: `Welcome, ${inputVal}!`,
        title: 'Greeting',
      };
    }

    logText = `[GUI Action]: Submitted text "${inputVal}"`;
    return { updatedComponents: updated, logText, newDialog };
  }

  return { updatedComponents: updated, logText, newDialog };
}
