export interface PluginManifest {
  id: string              // unique identifier, e.g. 'github-releases'
  name: string            // display name
  version: string         // semver
  author: string
  description: string
  homepage?: string
  icon?: string           // URL or base64 data URI
  permissions: PluginPermission[]
  patterns: string[]      // URL regex patterns this plugin handles
  entry?: string          // plugin binary entry point
  settings_schema?: PluginSettingsSchema
  min_core_version?: string
}

export type PluginPermission = 'network' | 'filesystem' | 'clipboard' | 'notifications' | 'shell'

export interface PluginSettingsSchema {
  [key: string]: PluginSettingField
}

export interface PluginSettingField {
  type: 'string' | 'number' | 'boolean' | 'select'
  label: string
  description?: string
  default?: unknown
  options?: { label: string; value: string }[]
  required?: boolean
}
