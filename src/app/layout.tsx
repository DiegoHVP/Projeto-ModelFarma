import MainContainer from './component/mainContainer';
import { ReactNode } from 'react';
import style from './layout.module.css'
interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Green-Farma',
  description: 'Qualidade e confianca é aqui',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt">
      <body className={style.body}>
        <MainContainer>{children}</MainContainer>
      </body>
    </html>
  );
}
