const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(dir, function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove useTranslation imports
    content = content.replace(/import\s+\{\s*useTranslation\s*\}\s+from\s+['"]react-i18next['"];?\r?\n?/g, '');
    
    // 2. Remove const { t, i18n } = useTranslation(); or const { t } = useTranslation();
    content = content.replace(/const\s+\{\s*t(?:,\s*i18n)?\s*\}\s*=\s*useTranslation\(\);\r?\n?/g, '');
    
    // 3. Replace {t('key', 'Fallback')} with Fallback
    content = content.replace(/\{t\(['"][^'"]+['"],\s*['"]([^'"]+)['"]\)\}/g, '$1');
    
    // 4. Replace t('key', 'Fallback') with 'Fallback'
    content = content.replace(/t\(['"][^'"]+['"],\s*(['"][^'"]+['"])\)/g, '$1');
    
    // 5. Replace specific case t(order.status.toLowerCase(), order.status) with order.status
    content = content.replace(/t\(order\.status\.toLowerCase\(\),\s*order\.status\)/g, 'order.status');

    // Also: {t('key')} -> '' (if any are missing fallbacks, which shouldn't be based on my grep, but just in case)
    
    // 6. Replace LanguageSwitcher imports and tags
    content = content.replace(/import\s+LanguageSwitcher\s+from\s+['"][^'"]+LanguageSwitcher['"];?\r?\n?/g, '');
    content = content.replace(/<div className="language-switcher-container"[^>]*>\s*<LanguageSwitcher[^>]*\/>\s*<\/div>/g, '');
    content = content.replace(/<LanguageSwitcher[^>]*\/>/g, '');

    // 7. Remove i18n usage in AnalyticsPage: i18n.language
    content = content.replace(/i18n\.language/g, '"en"');

    // 8. Fix stray t('navigation.settings') in sidebars if any
    content = content.replace(/\{t\(['"]navigation\.settings['"]\)\}/g, 'Settings');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Processed: ' + filePath);
    }
  }
});
