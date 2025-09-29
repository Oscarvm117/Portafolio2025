import './heroName.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ 
        margin: 0, 
        padding: 0,
        overflow: 'hidden',
        width: '100vw',
        height: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}