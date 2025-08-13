import LetterGlitch from "./components/LetterGlitch";
import Dock from "./components/Dock";
import Image from "next/image";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Define the items array for the Dock componen t
 // Replace with your actual items


const items = [
  { 
    icon: <Image src="/yo.svj" alt="Yo" width={32} height={32} />, 
    label: "Me", 
    onClick: () => alert("") 
  },
  { 
    icon: <Image src="/skills.svj" alt="Skills" width={32} height={32} />, 
    label: "Skills", 
    onClick: () => alert("") 
  },
  { 
    icon: <Image src="/projects.svj" alt="Projects" width={32} height={32} />, 
    label: "Projects", 
    onClick: () => alert("") 
  },
]

  return (
    <html lang="es">
      <body>
        {/* Fondo Letter Glitch */}
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />

        {/*DOCK */}
        <Dock 
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />

        
        {/* Tu contenido */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}