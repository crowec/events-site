import { useEffect } from 'react';

interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    effects: string[];
}


export const useTheme = (themeConfig: ThemeConfig) => {
    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty('--theme-primary', themeConfig.primaryColor);
        root.style.setProperty('--theme-secondary', themeConfig.secondaryColor);
        root.style.setProperty(
            '--theme-background',
            themeConfig.backgroundColor
        );
        root.style.setProperty('--theme-font', themeConfig.fontFamily);

        root.setAttribute('data-theme-effects', themeConfig.effects.join(' '));

        return () => {
            root.style.removeProperty('--theme-primary');
            root.style.removeProperty('--theme-secondary');
            root.style.removeProperty('--theme-background');
            root.style.removeProperty('--theme-font');
            root.removeAttribute('data-theme-effects');
        };
    }, [themeConfig]);
};
