import os
import re

def check_files():
    src_dir = r"c:\Users\Dhruv\DISHA-FOR-INDIA2\client\src"
    
    # Regex to find lucide-react imports
    lucide_regex = re.compile(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"]")
    
    results = []
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.jsx', '.js')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find lucide imports
                    imports = lucide_regex.findall(content)
                    if imports:
                        # Some files might have multiple import lines from lucide-react
                        all_imported_icons = []
                        for imp in imports:
                            icons = [i.strip() for i in imp.split(',')]
                            icons = [i.split(' as ')[0].strip() for i in icons if i]
                            
                            # Check for duplicates
                            if len(icons) != len(set(icons)):
                                results.append(f"{filepath} - Duplicate imports found: {icons}")
                                
                            all_imported_icons.extend(icons)
                        
                        # Check if all imported icons are actually used
                        for icon in all_imported_icons:
                            # A simple check: if the icon name appears anywhere else in the file
                            # outside of the import statement. 
                            # We can just count occurrences. If count == 1, it's only in import.
                            # But what if there are multiple imports of lucide-react?
                            # Regex to match whole word outside of import
                            # A hacky but effective way: remove the import statements, then search
                            content_without_imports = lucide_regex.sub('', content)
                            if not re.search(rf"\b{icon}\b", content_without_imports):
                                results.append(f"{filepath} - Unused icon: {icon}")
                                
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
                    
    for r in results:
        print(r)

if __name__ == "__main__":
    check_files()
