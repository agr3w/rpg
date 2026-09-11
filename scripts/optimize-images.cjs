const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processImage(inputPath, outputPath, maxWidth, quality = 80) {
  if (!fs.existsSync(inputPath)) {
    console.log(`Pular (não encontrado): ${inputPath}`);
    return;
  }
  const beforeStats = fs.statSync(inputPath);
  const beforeKB = (beforeStats.size / 1024).toFixed(1);

  let pipeline = sharp(inputPath);
  const metadata = await pipeline.metadata();

  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  pipeline = pipeline.webp({ quality });
  await pipeline.toFile(outputPath);

  const afterStats = fs.statSync(outputPath);
  const afterKB = (afterStats.size / 1024).toFixed(1);
  const reduction = (((beforeStats.size - afterStats.size) / beforeStats.size) * 100).toFixed(1);

  console.log(`Convertido: ${path.basename(inputPath)} (${beforeKB} KB) -> ${path.basename(outputPath)} (${afterKB} KB) [Redução de ${reduction}%]`);
}

async function run() {
  console.log('--- Otimizando Imagens de Cards (max 400px) ---');
  const cardsDir = path.resolve(__dirname, '../src/components/Cards/CardsImgs');
  const cardImages = ['Caderno.png', 'fichanova.png', 'livroDragao.png', 'MapsIcon.png', 'notanova.png'];
  for (const img of cardImages) {
    const input = path.join(cardsDir, img);
    const output = path.join(cardsDir, img.replace(/\.png$/i, '.webp'));
    await processImage(input, output, 400, 80);
  }

  console.log('\n--- Otimizando Backgrounds de Classes (max 1600px) ---');
  const classDir = path.resolve(__dirname, '../src/pages/FichaDetalhes/backgounds');
  if (fs.existsSync(classDir)) {
    const files = fs.readdirSync(classDir);
    for (const f of files) {
      if (/\.(jpe?g|png)$/i.test(f)) {
        const input = path.join(classDir, f);
        const output = path.join(classDir, f.replace(/\.(jpe?g|png)$/i, '.webp'));
        await processImage(input, output, 1600, 75);
      }
    }
  }

  console.log('\n--- Otimizando Imagens Adicionais ---');
  const forestInput = path.resolve(__dirname, '../src/pages/musicas/forest.jpg');
  if (fs.existsSync(forestInput)) {
    const forestOutput = path.resolve(__dirname, '../src/pages/musicas/forest.webp');
    await processImage(forestInput, forestOutput, 1600, 75);
  }

  const welcomeInput = path.resolve(__dirname, '../src/assets/backgrounds/auth/welcome.jpg');
  if (fs.existsSync(welcomeInput)) {
    const welcomeOutput = path.resolve(__dirname, '../src/assets/backgrounds/auth/welcome.webp');
    await processImage(welcomeInput, welcomeOutput, 1600, 75);
  }

  console.log('\nOtimização concluída!');
}

run().catch(console.error);
