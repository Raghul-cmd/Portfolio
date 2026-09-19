from PIL import Image
import math

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Sample background color from top corners and edges
    bg_samples = [
        pixels[10, 10][:3],
        pixels[width - 10, 10][:3],
        pixels[width // 2, 10][:3],
        pixels[10, height // 4][:3],
        pixels[width - 10, height // 4][:3]
    ]
    
    avg_r = sum(s[0] for s in bg_samples) / len(bg_samples)
    avg_g = sum(s[1] for s in bg_samples) / len(bg_samples)
    avg_b = sum(s[2] for s in bg_samples) / len(bg_samples)
    
    print(f"Sampled BG: ({avg_r:.1f}, {avg_g:.1f}, {avg_b:.1f})")
    
    new_img = Image.new("RGBA", (width, height))
    new_pixels = new_img.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Distance from sampled background color
            dist = math.sqrt((r - avg_r)**2 + (g - avg_g)**2 + (b - avg_b)**2)
            max_diff = max(abs(r - g), abs(g - b), abs(r - b))
            
            # High threshold for top region (sky/studio gray backdrop)
            is_top = (y < height * 0.75)
            thresh_strict = 45 if is_top else 35
            thresh_soft   = 70 if is_top else 55
            
            if dist < thresh_strict and max_diff < 22:
                alpha = 0
            elif dist < thresh_soft and max_diff < 28:
                alpha = int(255 * ((dist - thresh_strict) / (thresh_soft - thresh_strict)))
            else:
                alpha = 255
                
            new_pixels[x, y] = (r, g, b, alpha)
            
    new_img.save(output_path, "PNG")
    print(f"Saved cutout image to {output_path}")

if __name__ == "__main__":
    remove_background("images/hero.jpg", "images/hero_cutout.png")
