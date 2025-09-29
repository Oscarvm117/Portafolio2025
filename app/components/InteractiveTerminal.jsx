import React, { useState, useRef, useEffect } from 'react';

const InteractiveTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Portfolio Terminal v1.0' },
    { type: 'output', content: 'Type "help" to see available commands' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('~');
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Estructura de directorios
  const fileSystem = {
    '~': {
      type: 'dir',
      contents: ['about', 'projects', 'skills', 'contact'],
      description: 'Home directory'
    },
    'about': {
      type: 'dir',
      route: '/about',
      description: 'About me section'
    },
    'projects': {
      type: 'dir',
      route: '/projects',
      description: 'My projects portfolio'
    },
    'skills': {
      type: 'dir',
      route: '/skills',
      description: 'Technical skills and tools'
    },
    'contact': {
      type: 'dir',
      route: '/contact',
      description: 'Contact information'
    }
  };

  const commands = {
    help: () => ({
      output: [
        'Available commands:',
        '  ls          - List directory contents',
        '  cd [dir]    - Change directory',
        '  pwd         - Print working directory',
        '  whoami      - Display current user',
        '  about       - Quick access to about section',
        '  projects    - Quick access to projects',
        '  skills      - Quick access to skills',
        '  contact     - Quick access to contact',
        '  clear       - Clear terminal',
        '  help        - Show this help message',
      ].join('\n')
    }),
    ls: () => {
      const contents = fileSystem[currentPath]?.contents || [];
      return {
        output: contents.length > 0 
          ? contents.map(item => `📁 ${item}`).join('\n')
          : 'Directory is empty'
      };
    },
    pwd: () => ({
      output: currentPath === '~' ? '/home/portfolio' : `/home/portfolio/${currentPath}`
    }),
    whoami: () => ({
      output: 'Oscar Vergara - Full Stack Developer'
    }),
    clear: () => ({
      clear: true
    }),
    cd: (args) => {
      if (!args[0]) {
        setCurrentPath('~');
        return { output: '', newPath: '~' };
      }

      const target = args[0];
      
      if (target === '..') {
        setCurrentPath('~');
        return { output: '', newPath: '~' };
      }

      if (target === '~' || target === '/') {
        setCurrentPath('~');
        return { output: '', newPath: '~' };
      }

      if (fileSystem[target]) {
        if (fileSystem[target].route) {
          return {
            output: `Navigating to ${target}...`,
            navigate: fileSystem[target].route
          };
        }
        setCurrentPath(target);
        return { output: '', newPath: target };
      }

      return { output: `cd: ${target}: No such directory` };
    }
  };

  // Comandos de acceso rápido
  ['about', 'projects', 'skills', 'contact'].forEach(cmd => {
    commands[cmd] = () => ({
      output: `Opening ${cmd}...`,
      navigate: `/${cmd}`
    });
  });

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const [command, ...args] = trimmedCmd.split(' ');
    const newHistory = [
      ...history,
      { type: 'input', content: `${getPrompt()} ${trimmedCmd}` }
    ];

    if (commands[command]) {
      const result = commands[command](args);
      
      if (result.clear) {
        setHistory([]);
      } else if (result.navigate) {
        newHistory.push({ type: 'output', content: result.output });
        setHistory(newHistory);
        setTimeout(() => {
          console.log('Navigate to:', result.navigate);
          alert(`Navegando a: ${result.navigate}\n\nCuando crees estas páginas, reemplaza este alert con:\nrouter.push('${result.navigate}')`);
        }, 500);
      } else {
        if (result.output) {
          newHistory.push({ type: 'output', content: result.output });
        }
        setHistory(newHistory);
      }
    } else {
      newHistory.push({ 
        type: 'output', 
        content: `zsh: command not found: ${command}` 
      });
      setHistory(newHistory);
    }

    setCommandHistory([...commandHistory, trimmedCmd]);
    setHistoryIndex(-1);
    setInput('');
  };

  const getPrompt = () => {
    return `oscar@portfolio ${currentPath} %`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matches = Object.keys(commands).filter(cmd => 
        cmd.startsWith(input.trim())
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleOpen = () => {
    setIsVisible(true);
    setIsMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (!isVisible) {
    return (
      <button
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(50, 50, 50, 0.9))',
          backdropFilter: 'blur(10px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)';
        }}
      >
        <span style={{ color: '#7dd3fc', fontSize: '28px' }}>›_</span>
      </button>
    );
  }

  return (
    <div 
      onClick={() => !isMinimized && inputRef.current?.focus()}
      style={{
        position: 'fixed',
        bottom: isMinimized ? '-360px' : '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '900px',
        height: '400px',
        background: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.1) inset',
        cursor: isMinimized ? 'pointer' : 'text',
        zIndex: 1000,
        fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header estilo macOS */}
      <div 
        onClick={(e) => {
          if (isMinimized) {
            e.stopPropagation();
            handleMaximize();
          }
        }}
        style={{
        height: '40px',
        background: 'rgba(28, 28, 30, 0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        cursor: isMinimized ? 'pointer' : 'default',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ff5f57',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2)',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#febc2e',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2)',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          />
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#28c840',
            boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.2)',
          }} />
        </div>
        <div style={{
          flex: 1,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.3px',
        }}>
          oscar@portfolio — zsh
        </div>
      </div>

      {/* Terminal content */}
      <div style={{
        height: 'calc(100% - 40px)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Input area arriba */}
        <div style={{ 
          padding: '16px 20px 12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <span style={{ 
            color: '#7dd3fc',
            marginRight: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}>
            {getPrompt()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
              fontSize: '13px',
              caretColor: 'rgba(255, 255, 255, 0.9)',
            }}
            spellCheck={false}
          />
        </div>

        {/* Historial abajo */}
        <div
          ref={terminalRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 20px',
            paddingRight: '12px',
          }}
        >
          {history.map((entry, index) => (
            <div 
              key={index}
              style={{
                marginBottom: '4px',
                color: entry.type === 'input' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.75)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '13px',
                lineHeight: '1.5',
              }}
            >
              {entry.content}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollbar custom */}
      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          borderRadius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default InteractiveTerminal;