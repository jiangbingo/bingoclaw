// packages/skills/__tests__/dependency-manager.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DependencyManager } from '../dependency-manager'
import * as fs from 'fs'
import * as path from 'path'

describe('DependencyManager', () => {
  let manager: DependencyManager
  const testDir = '/tmp/test-skills-deps'

  beforeEach(() => {
    // 创建测试目录
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }

    manager = new DependencyManager(testDir)
  })

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('parseDependencies', () => {
    it('should parse dependencies from package.json', async () => {
      const skillPath = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillPath, { recursive: true })

      const packageJson = {
        name: 'test-skill',
        version: '1.0.0',
        dependencies: {
          lodash: '^4.17.21',
          axios: '^1.6.0',
        },
        peerDependencies: {
          react: '^18.0.0',
        },
        optionalDependencies: {
          'optional-pkg': '^1.0.0',
        },
      }

      fs.writeFileSync(
        path.join(skillPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )

      const deps = await manager.parseDependencies(skillPath)

      expect(deps).toHaveLength(4)
      expect(deps.find(d => d.name === 'lodash')).toBeDefined()
      expect(deps.find(d => d.name === 'lodash')?.required).toBe(true)
      expect(deps.find(d => d.name === 'optional-pkg')?.required).toBe(false)
    })

    it('should return empty array if no package.json', async () => {
      const skillPath = path.join(testDir, 'no-package-json')
      fs.mkdirSync(skillPath, { recursive: true })

      const deps = await manager.parseDependencies(skillPath)

      expect(deps).toHaveLength(0)
    })

    it('should handle invalid package.json', async () => {
      const skillPath = path.join(testDir, 'invalid-package-json')
      fs.mkdirSync(skillPath, { recursive: true })

      fs.writeFileSync(
        path.join(skillPath, 'package.json'),
        'invalid json'
      )

      const deps = await manager.parseDependencies(skillPath)

      expect(deps).toHaveLength(0)
    })
  })

  describe('checkDependencies', () => {
    it('should detect missing dependencies', async () => {
      const skillPath = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillPath, { recursive: true })

      const packageJson = {
        name: 'test-skill',
        version: '1.0.0',
        dependencies: {
          'non-existent-package': '^1.0.0',
        },
      }

      fs.writeFileSync(
        path.join(skillPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )

      const check = await manager.checkDependencies('test-skill')

      expect(check.valid).toBe(false)
      expect(check.missing).toHaveLength(1)
      expect(check.missing[0].name).toBe('non-existent-package')
    })

    it('should pass if all dependencies are satisfied', async () => {
      const skillPath = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillPath, { recursive: true })

      const packageJson = {
        name: 'test-skill',
        version: '1.0.0',
        dependencies: {}, // No dependencies
      }

      fs.writeFileSync(
        path.join(skillPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )

      const check = await manager.checkDependencies('test-skill')

      expect(check.valid).toBe(true)
      expect(check.missing).toHaveLength(0)
    })
  })

  describe('getDependencyTree', () => {
    it('should build dependency tree', async () => {
      const skillPath = path.join(testDir, 'test-skill')
      fs.mkdirSync(skillPath, { recursive: true })

      const packageJson = {
        name: 'test-skill',
        version: '1.0.0',
        dependencies: {
          lodash: '^4.17.21',
          axios: '^1.6.0',
        },
      }

      fs.writeFileSync(
        path.join(skillPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )

      const tree = await manager.getDependencyTree('test-skill')

      expect(tree.name).toBe('test-skill')
      expect(tree.version).toBe('1.0.0')
      expect(tree.dependencies).toHaveLength(2)
      expect(tree.dependencies[0].name).toBe('lodash')
    })

    it('should handle missing package.json', async () => {
      const skillPath = path.join(testDir, 'no-package-json')
      fs.mkdirSync(skillPath, { recursive: true })

      const tree = await manager.getDependencyTree('no-package-json')

      expect(tree.name).toBe('no-package-json')
      expect(tree.version).toBe('unknown')
      expect(tree.dependencies).toHaveLength(0)
    })
  })

  describe('version checking', () => {
    it('should satisfy wildcard version', () => {
      // 使用 any 访问私有方法
      const satisfies = (manager as any).satisfiesVersion('1.0.0', '*')
      expect(satisfies).toBe(true)
    })

    it('should satisfy exact version', () => {
      const satisfies = (manager as any).satisfiesVersion('1.0.0', '1.0.0')
      expect(satisfies).toBe(true)
    })

    it('should not satisfy different version', () => {
      const satisfies = (manager as any).satisfiesVersion('2.0.0', '1.0.0')
      expect(satisfies).toBe(false)
    })
  })
})
