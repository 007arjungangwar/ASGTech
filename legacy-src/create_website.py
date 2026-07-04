from pathlib import Path

# Use current folder where script is located
base_path = Path(__file__).parent

files = [
    "index.html",
    "blog.html",
    "projects.html",
    "about.html",
    "style.css"
]

post_files = [
    "post1.html",
    "post2.html"
]

def create_structure():
    # Create main files
    for file in files:
        (base_path / file).touch(exist_ok=True)
    
    # Create posts folder
    posts_path = base_path / "posts"
    posts_path.mkdir(exist_ok=True)
    
    # Create post files
    for post in post_files:
        (posts_path / post).touch(exist_ok=True)
    
    print("✅ Structure created successfully!")
    print(f"📂 Location: {base_path}")

if __name__ == "__main__":
    create_structure()