#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌞 Welcome to WakeyTalky Setup!');
console.log('=====================================\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Create necessary directories
const directories = [
  'src/components',
  'src/screens',
  'src/services',
  'src/context',
  'src/constants',
  'src/types',
  'src/config',
  'src/utils',
  'src/assets',
  'src/assets/images',
  'src/assets/sounds',
  'android/app/src/main/res',
  'ios/WakeyTalky',
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

// Create .env file if it doesn't exist
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  const envContent = `# WakeyTalky Environment Configuration

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Firebase Configuration (if using Firebase)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Supabase Configuration (if using Supabase)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Cloud Configuration (for voice storage)
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket_name

# Azure TTS Configuration (alternative to ElevenLabs)
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here

# Bark AI Configuration (for singing voice)
BARK_API_KEY=your_bark_api_key_here

# App Configuration
APP_ENV=development
DEBUG_MODE=true
LOG_LEVEL=debug

# Voice Generation Settings
DEFAULT_VOICE_ID=default-voice-id
DEFAULT_SINGING_STYLE=pop-diva
MAX_VOICE_DURATION=40
VOICE_GENERATION_TIMEOUT=30000

# Alarm Settings
DEFAULT_SNOOZE_INTERVAL=5
MAX_SNOOZE_COUNT=3
CHALLENGE_MODE_ENABLED=true
CHALLENGE_TIME_LIMIT=60

# Notification Settings
NOTIFICATION_SOUND_ENABLED=true
VIBRATION_ENABLED=true
BACKGROUND_ALARM_ENABLED=true

# AI Settings
AI_MODEL=gpt-4
AI_TEMPERATURE=0.8
AI_MAX_TOKENS=300
AI_PRESENCE_PENALTY=0.1
AI_FREQUENCY_PENALTY=0.1
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created: .env file');
}

// Create metro.config.js if it doesn't exist
const metroConfigPath = 'metro.config.js';
if (!fs.existsSync(metroConfigPath)) {
  const metroConfig = `const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  const { transformer, resolver } = config;
  
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };
  
  return config;
})();
`;

  fs.writeFileSync(metroConfigPath, metroConfig);
  console.log('✅ Created: metro.config.js');
}

// Create babel.config.js if it doesn't exist
const babelConfigPath = 'babel.config.js';
if (!fs.existsSync(babelConfigPath)) {
  const babelConfig = `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
`;

  fs.writeFileSync(babelConfigPath, babelConfig);
  console.log('✅ Created: babel.config.js');
}

// Create .gitignore if it doesn't exist
const gitignorePath = '.gitignore';
if (!fs.existsSync(gitignorePath)) {
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# React Native
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/
`;

  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('✅ Created: .gitignore');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install');
console.log('2. Configure your API keys in the .env file');
console.log('3. For iOS: cd ios && pod install');
console.log('4. Start the development server: npm start');
console.log('5. Run on Android: npm run android');
console.log('6. Run on iOS: npm run ios');
console.log('\n🔑 Required API Keys:');
console.log('- OpenAI API Key (for AI voice generation)');
console.log('- ElevenLabs API Key (for voice synthesis)');
console.log('- Firebase/Supabase (for backend services)');
console.log('\n📚 Documentation:');
console.log('- Check the README.md for detailed setup instructions');
console.log('- Visit the project repository for updates');
console.log('\n🌞 Happy coding with WakeyTalky!'); 