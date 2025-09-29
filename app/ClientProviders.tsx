'use client';
import { useEffect } from "react";
import InteractiveTerminal from "./components/InteractiveTerminal";  
import FaultyTerminal from "./components/FaultyTerminal";
import "./heroName.css"
import TextType from "./components/TextType";

export default function ClientProviders() {
  // Cargar la fuente Fira Code dinámicamente
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap';
    link3.rel = 'stylesheet';
    document.head.appendChild(link3);

    return () => {
      if (document.head.contains(link1)) document.head.removeChild(link1);
      if (document.head.contains(link2)) document.head.removeChild(link2);
      if (document.head.contains(link3)) document.head.removeChild(link3);
    };
  }, []);

  return (
    <>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1
      }}>
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.2}
          tint="#396331"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
          className=""
          style={{}}
        />
      </div>

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        textAlign: 'center',
        width: '100%',
        pointerEvents: 'none'
      }}>
        <TextType
          className="hero-name"
          text={[
            "root@kali:~# whoami\nOscar Vergara",
            "root@kali:~# cd /Mi-Portafolio"
          ]}
          typingSpeed={75}
          pauseDuration={1000}
          showCursor={true}
          cursorCharacter="|"
          variableSpeed={false}
          onSentenceComplete={() => console.log("Sentence completed")}
        />
      </div>

      <InteractiveTerminal />
    </>
  );
}