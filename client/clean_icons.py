import os
import re

def fix_unused_imports():
    src_dir = r"c:\Users\Dhruv\DISHA-FOR-INDIA2\client\src"
    lucide_regex = re.compile(r"(import\s+\{)([^}]+)(\}\s+from\s+['\"]lucide-react['\"])")
    
    modified_files = 0
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.jsx', '.js')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find all lucide imports
                    imports = lucide_regex.findall(content)
                    if not imports:
                        continue
                        
                    content_without_imports = lucide_regex.sub('', content)
                    new_content = content
                    
                    for match in lucide_regex.finditer(content):
                        prefix, icons_str, suffix = match.groups()
                        icons = [i.strip() for i in icons_str.split(',')]
                        
                        used_icons = []
                        for icon_import in icons:
                            if not icon_import:
                                continue
                            icon_name = icon_import.split(' as ')[0].strip()
                            # Check if used
                            if re.search(rf"\b{icon_name}\b", content_without_imports):
                                used_icons.append(icon_import)
                                
                        if used_icons != icons:
                            # We have unused icons
                            if used_icons:
                                new_import = f"{prefix} {', '.join(used_icons)} {suffix}"
                            else:
                                new_import = "" # Remove the import entirely if empty
                                
                            new_content = new_content.replace(match.group(0), new_import)
                            
                    if new_content != content:
                        # Clean up any blank lines left by removing the import
                        new_content = re.sub(r'\n\s*\n', '\n\n', new_content)
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified_files += 1
                        print(f"Cleaned up {filepath}")
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
                    
    print(f"Total files cleaned up: {modified_files}")

if __name__ == "__main__":
    fix_unused_imports()
