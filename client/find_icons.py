import os
import re

def check_files():
    src_dir = r"c:\Users\Dhruv\DISHA-FOR-INDIA2\client\src"
    
    # Regex to find all JSX components <ComponentName
    comp_regex = re.compile(r'<([A-Z][a-zA-Z0-9]*)\b')
    
    results = []
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.jsx', '.js')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Find all used tags
                    tags = set(comp_regex.findall(content))
                    
                    for tag in tags:
                        # Skip common React tags that might not be imported or standard HTML
                        if tag in ['Fragment', 'Suspense']:
                            continue
                            
                        # Check if it's defined (import, const, function, class, let)
                        # We use simple regex checks
                        import_pattern = rf"import\s+[\s\S]*?\b{tag}\b[\s\S]*?from"
                        def_pattern = rf"(const|let|var|function|class)\s+{tag}\b"
                        
                        if not (re.search(import_pattern, content) or re.search(def_pattern, content)):
                            # Check if the tag is extracted from a prop or context
                            prop_pattern = rf"const\s+{{[\s\S]*?\b{tag}\b[\s\S]*?}}\s*="
                            if not re.search(prop_pattern, content):
                                results.append(f"{filepath} - Missing: {tag}")
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
                    
    for r in results:
        print(r)

if __name__ == "__main__":
    check_files()
