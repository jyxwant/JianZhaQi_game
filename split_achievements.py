"""
切分成就图片脚本
将2x2的合成图切分为4张独立图片
"""
from PIL import Image
import os

def split_achievements():
    # 读取源图片
    source_path = "source.jpg"
    
    if not os.path.exists(source_path):
        print(f"❌ 错误: 找不到 {source_path}")
        print("请先把合成图片放到项目根目录，命名为 source.jpg")
        return
    
    print(f"📖 正在读取: {source_path}")
    img = Image.open(source_path)
    width, height = img.size
    print(f"📐 原图尺寸: {width} x {height}")
    
    # 计算每张卡片的尺寸 (2x2 布局)
    card_width = width // 2
    card_height = height // 2
    print(f"📐 单卡尺寸: {card_width} x {card_height}")
    
    # 创建输出目录
    output_dir = "public/achievements"
    os.makedirs(output_dir, exist_ok=True)
    print(f"📁 输出目录: {output_dir}")
    
    # 切分位置映射 (左上, 右上, 左下, 右下)
    # 对应: 绝世恋爱脑, 鉴渣实习生, 鉴渣达人, 人间清醒
    positions = [
        (0, 0, card_width, card_height),                    # 左上 -> achievement_1
        (card_width, 0, width, card_height),                # 右上 -> achievement_2
        (0, card_height, card_width, height),               # 左下 -> achievement_3
        (card_width, card_height, width, height),           # 右下 -> achievement_4
    ]
    
    names = [
        ("achievement_1.png", "绝世恋爱脑"),
        ("achievement_2.png", "鉴渣实习生"),
        ("achievement_3.png", "鉴渣达人"),
        ("achievement_4.png", "人间清醒"),
    ]
    
    # 切分并保存
    for i, (pos, (filename, title)) in enumerate(zip(positions, names)):
        print(f"✂️  切分中: {title} -> {filename}")
        cropped = img.crop(pos)
        output_path = os.path.join(output_dir, filename)
        cropped.save(output_path, "PNG", quality=95)
        print(f"✅ 已保存: {output_path}")
    
    print("\n🎉 切分完成！共生成 4 张成就图片")
    print(f"📂 位置: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    split_achievements()
