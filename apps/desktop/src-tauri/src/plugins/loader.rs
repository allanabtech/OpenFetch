use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::{Path, PathBuf};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub description: String,
    pub permissions: Vec<String>,
    pub patterns: Vec<String>,
    pub entry: String,
    pub settings_schema: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PluginInfo {
    pub id: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub description: String,
    pub enabled: bool,
    pub installed_at: String,
}

pub struct PluginLoader {
    pub plugin_dir: PathBuf,
    pub loaded_plugins: HashMap<String, PluginManifest>,
}

impl PluginLoader {
    pub fn new(plugin_dir: &Path) -> Self {
        Self {
            plugin_dir: plugin_dir.to_path_buf(),
            loaded_plugins: HashMap::new(),
        }
    }

    pub fn load_all(&mut self) -> Result<()> {
        // Stub implementation
        Ok(())
    }

    pub fn load_plugin(&self, _path: &Path) -> Result<PluginManifest> {
        // Stub implementation
        Ok(PluginManifest {
            id: "stub".into(),
            name: "stub".into(),
            version: "1.0".into(),
            author: "stub".into(),
            description: "".into(),
            permissions: vec![],
            patterns: vec![],
            entry: "main.js".into(),
            settings_schema: None,
        })
    }

    pub fn get_all(&self) -> Vec<PluginInfo> {
        vec![]
    }

    pub fn enable(&mut self, _id: &str) {}
    pub fn disable(&mut self, _id: &str) {}

    pub fn find_plugin_for_url(&self, _url: &str) -> Option<&PluginManifest> {
        None
    }
}
