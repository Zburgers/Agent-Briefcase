import './globals.css';

export const metadata = {
  title: 'Agent Briefcase',
  description: 'Turn chaotic instructions into agent‑ready execution briefs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}