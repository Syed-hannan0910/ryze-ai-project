// ============================================================
// FIXED COMPONENT LIBRARY
// These components are IMMUTABLE - the AI only selects and
// configures them. It never creates new ones.
// ============================================================

export const COMPONENT_LIBRARY = {
  Button: {
    description: "A clickable button for actions",
    props: {
      label: { type: "string", required: true },
      variant: { type: "enum", values: ["primary", "secondary", "danger", "ghost"], default: "primary" },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md" },
      disabled: { type: "boolean", default: false },
      onClick: { type: "function", default: null }
    }
  },
  Card: {
    description: "A container box for grouping related content",
    props: {
      title: { type: "string", required: false },
      subtitle: { type: "string", required: false },
      children: { type: "ReactNode", required: false },
      elevated: { type: "boolean", default: false },
      padding: { type: "enum", values: ["none", "sm", "md", "lg"], default: "md" }
    }
  },
  Input: {
    description: "A text input field for user data entry",
    props: {
      label: { type: "string", required: false },
      placeholder: { type: "string", required: false },
      type: { type: "enum", values: ["text", "email", "password", "number", "search"], default: "text" },
      value: { type: "string", default: "" },
      disabled: { type: "boolean", default: false },
      error: { type: "string", required: false }
    }
  },
  Table: {
    description: "A data grid for displaying rows and columns of data",
    props: {
      columns: { type: "array", required: true, description: "Array of { key, label, width? }" },
      data: { type: "array", required: true, description: "Array of row objects" },
      striped: { type: "boolean", default: true },
      compact: { type: "boolean", default: false }
    }
  },
  Modal: {
    description: "A dialog overlay for focused interactions",
    props: {
      title: { type: "string", required: true },
      isOpen: { type: "boolean", required: true },
      onClose: { type: "function", required: true },
      children: { type: "ReactNode", required: false },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md" }
    }
  },
  Sidebar: {
    description: "A vertical navigation panel on the left or right side",
    props: {
      items: { type: "array", required: true, description: "Array of { label, icon?, href?, active? }" },
      title: { type: "string", required: false },
      width: { type: "enum", values: ["narrow", "normal", "wide"], default: "normal" },
      collapsed: { type: "boolean", default: false }
    }
  },
  Navbar: {
    description: "A top navigation bar with logo and links",
    props: {
      brand: { type: "string", required: true },
      links: { type: "array", required: false, description: "Array of { label, href, active? }" },
      actions: { type: "array", required: false, description: "Array of { label, variant? }" },
      sticky: { type: "boolean", default: false }
    }
  },
  Chart: {
    description: "A data visualization chart (uses mocked data)",
    props: {
      type: { type: "enum", values: ["bar", "line", "pie", "area"], default: "bar" },
      title: { type: "string", required: false },
      data: { type: "array", required: true, description: "Array of { label, value }" },
      color: { type: "enum", values: ["blue", "green", "purple", "orange", "red"], default: "blue" },
      height: { type: "number", default: 200 }
    }
  },
  Badge: {
    description: "A small status indicator or label",
    props: {
      label: { type: "string", required: true },
      variant: { type: "enum", values: ["default", "success", "warning", "error", "info"], default: "default" }
    }
  },
  Alert: {
    description: "An informational or status message block",
    props: {
      message: { type: "string", required: true },
      type: { type: "enum", values: ["info", "success", "warning", "error"], default: "info" },
      dismissible: { type: "boolean", default: false }
    }
  },
  Avatar: {
    description: "A user avatar with initials or image",
    props: {
      name: { type: "string", required: true },
      size: { type: "enum", values: ["sm", "md", "lg"], default: "md" },
      src: { type: "string", required: false }
    }
  },
  Stat: {
    description: "A metric display with a label and value",
    props: {
      label: { type: "string", required: true },
      value: { type: "string", required: true },
      change: { type: "string", required: false, description: "e.g. '+12%'" },
      positive: { type: "boolean", default: true }
    }
  }
};

export const ALLOWED_COMPONENTS = Object.keys(COMPONENT_LIBRARY);

// ============================================================
// COMPONENT IMPLEMENTATIONS (Actual React code - never changes)
// ============================================================

export const COMPONENT_IMPLEMENTATIONS = `
// ===== FIXED COMPONENT LIBRARY =====
// These implementations NEVER change.

function Button({ label, variant = "primary", size = "md", disabled = false, onClick }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 cursor-pointer border-0";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-500",
    ghost: "bg-transparent text-indigo-600 hover:bg-indigo-50 border border-indigo-300"
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[base, sizes[size] || sizes.md, variants[variant] || variants.primary, disabled ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
    >{label}</button>
  );
}

function Card({ title, subtitle, children, elevated = false, padding = "md" }) {
  const paddings = { none: "p-0", sm: "p-3", md: "p-5", lg: "p-8" };
  return (
    <div className={["bg-white rounded-xl border border-gray-200", elevated ? "shadow-lg" : "shadow-sm", paddings[padding] || paddings.md].join(" ")}>
      {title && <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>}
      {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

function Input({ label, placeholder, type = "text", value = "", disabled = false, error, onChange }) {
  const [val, setVal] = React.useState(value);
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={val}
        disabled={disabled}
        onChange={e => { setVal(e.target.value); onChange && onChange(e); }}
        className={["w-full px-3 py-2 text-sm rounded-lg border bg-white transition-all outline-none",
          error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          disabled ? "bg-gray-50 cursor-not-allowed opacity-60" : ""].join(" ")}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Table({ columns = [], data = [], striped = true, compact = false }) {
  const cellPad = compact ? "px-3 py-1.5" : "px-4 py-3";
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>{columns.map(col => <th key={col.key} className={\`\${cellPad} text-left font-semibold text-gray-600 text-xs uppercase tracking-wide\`} style={col.width ? {width: col.width} : {}}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={striped && i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
              {columns.map(col => <td key={col.key} className={\`\${cellPad} text-gray-700 border-b border-gray-100\`}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, isOpen, onClose, children, size = "md" }) {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className={["relative bg-white rounded-2xl shadow-2xl w-full", sizes[size] || sizes.md].join(" ")}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Sidebar({ items = [], title, width = "normal", collapsed = false }) {
  const widths = { narrow: "w-14", normal: "w-56", wide: "w-72" };
  return (
    <aside className={\`\${widths[width] || widths.normal} h-full bg-gray-900 text-white flex flex-col py-4\`}>
      {title && !collapsed && <div className="px-4 mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">{title}</div>}
      <nav className="flex flex-col gap-1 px-2">
        {items.map((item, i) => (
          <a key={i} href={item.href || "#"} className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all \${item.active ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}\`}>
            {item.icon && <span className="text-base">{item.icon}</span>}
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Navbar({ brand, links = [], actions = [], sticky = false }) {
  return (
    <nav className={\`bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between \${sticky ? "sticky top-0 z-40 shadow-sm" : ""}\`}>
      <span className="text-lg font-bold text-gray-900 tracking-tight">{brand}</span>
      <div className="flex items-center gap-6">
        {links.map((link, i) => (
          <a key={i} href={link.href || "#"} className={\`text-sm font-medium transition-colors \${link.active ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"}\`}>{link.label}</a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, i) => <Button key={i} label={action.label} variant={action.variant || "primary"} size="sm" />)}
      </div>
    </nav>
  );
}

function Chart({ type = "bar", title, data = [], color = "blue", height = 200 }) {
  const colors = { blue: "#6366f1", green: "#22c55e", purple: "#a855f7", orange: "#f97316", red: "#ef4444" };
  const col = colors[color] || colors.blue;
  const max = Math.max(...data.map(d => d.value), 1);
  
  if (type === "pie") {
    const total = data.reduce((s, d) => s + d.value, 0);
    let angle = -90;
    const slices = data.map((d, i) => {
      const pct = d.value / total;
      const start = angle;
      angle += pct * 360;
      const hue = (i * 60) % 360;
      return { ...d, start, end: angle, hue };
    });
    return (
      <div className="flex flex-col gap-2">
        {title && <h4 className="text-sm font-semibold text-gray-700">{title}</h4>}
        <div className="flex items-center gap-4">
          <svg width={height} height={height} viewBox="0 0 100 100">
            {slices.map((s, i) => {
              const startRad = (s.start * Math.PI) / 180;
              const endRad = (s.end * Math.PI) / 180;
              const x1 = 50 + 45 * Math.cos(startRad);
              const y1 = 50 + 45 * Math.sin(startRad);
              const x2 = 50 + 45 * Math.cos(endRad);
              const y2 = 50 + 45 * Math.sin(endRad);
              const large = s.end - s.start > 180 ? 1 : 0;
              return <path key={i} d={\`M50,50 L\${x1},\${y1} A45,45 0 \${large},1 \${x2},\${y2} Z\`} fill={\`hsl(\${s.hue}, 65%, 55%)\`} opacity="0.9"/>;
            })}
          </svg>
          <div className="flex flex-col gap-1">
            {data.map((d, i) => <div key={i} className="flex items-center gap-2 text-xs text-gray-600"><span className="w-2 h-2 rounded-full" style={{background: \`hsl(\${(i*60)%360}, 65%, 55%)\`}}/>{d.label}: {d.value}</div>)}
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "line" || type === "area") {
    const pts = data.map((d, i) => ({ x: (i / (data.length - 1)) * 280 + 10, y: height - 20 - ((d.value / max) * (height - 40)) }));
    const path = pts.map((p, i) => \`\${i === 0 ? "M" : "L"}\${p.x},\${p.y}\`).join(" ");
    const area = path + \` L\${pts[pts.length-1].x},\${height-20} L10,\${height-20} Z\`;
    return (
      <div>
        {title && <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>}
        <svg width="300" height={height} style={{overflow:"visible"}}>
          {type === "area" && <path d={area} fill={col} opacity="0.15"/>}
          <path d={path} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={col}/>)}
          {data.map((d, i) => <text key={i} x={pts[i].x} y={height-4} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.label}</text>)}
        </svg>
      </div>
    );
  }
  
  return (
    <div>
      {title && <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>}
      <div className="flex items-end gap-2" style={{height}}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-md transition-all" style={{height: \`\${(d.value / max) * (height - 24)}px\`, background: col, opacity: 0.85}}/>
            <span className="text-xs text-gray-500 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ label, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700"
  };
  return <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold \${variants[variant] || variants.default}\`}>{label}</span>;
}

function Alert({ message, type = "info", dismissible = false }) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  return (
    <div className={\`flex items-center gap-3 p-4 rounded-lg border \${styles[type] || styles.info}\`}>
      <span>{icons[type]}</span>
      <p className="text-sm flex-1">{message}</p>
      {dismissible && <button onClick={() => setVisible(false)} className="text-current opacity-60 hover:opacity-100">×</button>}
    </div>
  );
}

function Avatar({ name, size = "md", src }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-violet-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={\`rounded-full flex items-center justify-center font-bold text-white overflow-hidden \${sizes[size] || sizes.md} \${!src ? color : ""}\`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover"/> : initials}
    </div>
  );
}

function Stat({ label, value, change, positive = true }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change && <p className={\`text-sm mt-1 font-medium \${positive ? "text-green-600" : "text-red-500"}\`}>{positive ? "↑" : "↓"} {change}</p>}
    </div>
  );
}
// ===== END FIXED COMPONENT LIBRARY =====
`;

export const COMPONENT_SCHEMA_PROMPT = `
You have access to ONLY these components (you cannot create new ones):
${Object.entries(COMPONENT_LIBRARY).map(([name, info]) => `
- ${name}: ${info.description}
  Props: ${Object.entries(info.props).map(([p, d]) => `${p}(${d.type}${d.required ? ', required' : ''})`).join(', ')}
`).join('')}

RULES:
1. Use ONLY these components
2. No inline styles
3. No new CSS
4. No external libraries
5. Import nothing - all components are globally available
6. Use React.useState for any state
7. Default export a component called App
`;
