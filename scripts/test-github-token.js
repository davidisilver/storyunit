#!/usr/bin/env node

/**
 * Test script to verify GitHub token setup
 * Usage: node scripts/test-github-token.js
 */

require('dotenv').config({ path: '.env.local' });

async function testGitHubToken() {
  const githubToken = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  console.log('🔍 Testing GitHub token setup...\n');

  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN not found in .env.local');
    console.log('📝 Please add your GitHub token to .env.local:');
    console.log('   GITHUB_TOKEN=ghp_your_token_here');
    process.exit(1);
  }

  if (!repository) {
    console.error('❌ GITHUB_REPOSITORY not found in .env.local');
    console.log('📝 Please add your repository to .env.local:');
    console.log('   GITHUB_REPOSITORY=your-username/storyunit-main');
    process.exit(1);
  }

  console.log('✅ GITHUB_TOKEN found');
  console.log('✅ GITHUB_REPOSITORY found:', repository);

  try {
    // Test the token by making a simple API call
    const response = await fetch(`https://api.github.com/repos/${repository}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const repoData = await response.json();
      console.log('✅ GitHub token is valid!');
      console.log('📊 Repository:', repoData.full_name);
      console.log('🔗 URL:', repoData.html_url);
      console.log('📝 Description:', repoData.description || 'No description');
      
      // Check if Actions are enabled
      const actionsResponse = await fetch(`https://api.github.com/repos/${repository}/actions/workflows`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (actionsResponse.ok) {
        console.log('✅ GitHub Actions are enabled');
        console.log('🚀 Ready to use video rendering workflow!');
      } else {
        console.log('⚠️  GitHub Actions might not be enabled');
      }

    } else {
      console.error('❌ GitHub token is invalid or has insufficient permissions');
      console.log('🔧 Please check:');
      console.log('   1. Token is correct');
      console.log('   2. Token has "repo" permissions');
      console.log('   3. Repository exists and is accessible');
    }

  } catch (error) {
    console.error('❌ Error testing GitHub token:', error.message);
  }

  console.log('\n📋 Next steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Go to Actions tab in your repository');
  console.log('3. Run the "Render Video" workflow');
  console.log('4. Export composition data with: node scripts/export-composition.js <project-id>');
}

testGitHubToken(); 