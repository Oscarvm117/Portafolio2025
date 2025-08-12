import LetterGlitch from "./components/LetterGlitch";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        
        {/* Tu contenido */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}