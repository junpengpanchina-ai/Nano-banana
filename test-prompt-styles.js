#!/usr/bin/env node

/**
 * 测试不同风格的提示词生成
 * 验证风格差异是否明显
 */

console.log('🎨 测试不同风格的提示词生成...\n');

// 模拟提示词生成逻辑
function generateEnhancedPrompt(prompt, style, hasImage = false) {
  let enhancedPrompt = prompt;
  
  if (hasImage) {
    console.log(`🖼️ 图片到图片模式：基于上传图片生成手办 (${style}风格)`);
    if (style === 'realistic') {
      enhancedPrompt = `photorealistic figure sculpture of ${prompt}, 1/7 scale collectible figure, hyper-realistic materials, detailed skin texture, realistic fabric textures, professional photography lighting, museum quality, lifelike human features, detailed facial features, realistic hair, professional figure photography, high-end collectible, premium quality`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `chibi cartoon figure of ${prompt}, 1/7 scale cute collectible, big eyes, simplified features, chibi style, kawaii design, pastel colors, cute expression, simplified anatomy, adorable pose, cartoon art style, simplified shading, cute and playful, child-friendly design, toy-like appearance`;
    } else {
      enhancedPrompt = `anime figure of ${prompt}, 1/7 scale anime collectible, cel-shaded style, vibrant anime colors, manga-style features, anime character design, detailed anime art, sharp clean lines, anime shading, bright colorful palette, anime pose, manga illustration style, anime figure model`;
    }
  } else {
    console.log(`🎨 文本到图片模式：生成手办 (${style}风格)`);
    if (style === 'realistic') {
      enhancedPrompt = `photorealistic figure sculpture of ${prompt}, 1/7 scale collectible figure, hyper-realistic materials, detailed skin texture, realistic fabric textures, professional photography lighting, museum quality, lifelike human features, detailed facial features, realistic hair, professional figure photography, high-end collectible, premium quality, realistic pose`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `chibi cartoon figure of ${prompt}, 1/7 scale cute collectible, big eyes, simplified features, chibi style, kawaii design, pastel colors, cute expression, simplified anatomy, adorable pose, cartoon art style, simplified shading, cute and playful, child-friendly design, toy-like appearance, chibi pose`;
    } else {
      enhancedPrompt = `anime figure of ${prompt}, 1/7 scale anime collectible, cel-shaded style, vibrant anime colors, manga-style features, anime character design, detailed anime art, sharp clean lines, anime shading, bright colorful palette, anime pose, manga illustration style, anime figure model, dynamic anime pose`;
    }
  }
  
  return enhancedPrompt;
}

// 测试用例
const testCases = [
  { prompt: 'cute magical girl character', style: 'anime', hasImage: false },
  { prompt: 'cute magical girl character', style: 'realistic', hasImage: false },
  { prompt: 'cute magical girl character', style: 'cartoon', hasImage: false },
  { prompt: 'warrior character', style: 'anime', hasImage: true },
  { prompt: 'warrior character', style: 'realistic', hasImage: true },
  { prompt: 'warrior character', style: 'cartoon', hasImage: true }
];

testCases.forEach((testCase, index) => {
  console.log(`\n📝 测试用例 ${index + 1}:`);
  console.log(`   原始提示词: "${testCase.prompt}"`);
  console.log(`   风格: ${testCase.style}`);
  console.log(`   模式: ${testCase.hasImage ? '图片到图片' : '文本到图片'}`);
  
  const enhancedPrompt = generateEnhancedPrompt(testCase.prompt, testCase.style, testCase.hasImage);
  
  console.log(`\n🎯 增强提示词:`);
  console.log(`   ${enhancedPrompt}`);
  
  // 分析关键词差异
  const keywords = {
    realistic: ['photorealistic', 'hyper-realistic', 'lifelike', 'realistic', 'professional photography'],
    cartoon: ['chibi', 'cute', 'kawaii', 'simplified', 'toy-like', 'child-friendly'],
    anime: ['anime', 'cel-shaded', 'manga', 'vibrant', 'anime character', 'anime art']
  };
  
  const styleKeywords = keywords[testCase.style] || [];
  const foundKeywords = styleKeywords.filter(keyword => 
    enhancedPrompt.toLowerCase().includes(keyword.toLowerCase())
  );
  
  console.log(`\n🔍 风格关键词检查:`);
  console.log(`   期望关键词: ${styleKeywords.join(', ')}`);
  console.log(`   找到关键词: ${foundKeywords.join(', ')}`);
  console.log(`   匹配度: ${foundKeywords.length}/${styleKeywords.length} (${Math.round(foundKeywords.length/styleKeywords.length*100)}%)`);
  
  console.log('\n' + '='.repeat(80));
});

console.log('\n✅ 提示词风格测试完成！');
console.log('\n📊 总结:');
console.log('   - 写实风格: 强调 photorealistic, hyper-realistic, lifelike 等');
console.log('   - 卡通风格: 强调 chibi, cute, kawaii, simplified 等');
console.log('   - 动漫风格: 强调 anime, cel-shaded, manga, vibrant 等');
console.log('\n🎯 现在不同风格应该能产生明显不同的效果！');
