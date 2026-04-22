mod relative;

use std::path::Path;

use ref_cast::RefCast;

#[derive(Debug, RefCast)]
#[repr(transparent)]
pub struct RelativePath(str);

impl RelativePath {
    pub fn new(path: &str) -> &Self {
        Self::ref_cast(path)
    }

    // #[ref_cast_custom]
    // // 这个函数签名就是契约
    // unsafe fn ref_cast(s: &str) -> &Self;

    pub fn to_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, RefCast)]
#[repr(transparent)]
pub struct AbsPath(Path);

impl AbsPath {
    pub fn new(path: &Path) -> &Self {
        Self::ref_cast(path)
    }

    pub fn to_path(&self) -> &Path {
        &self.0
    }
}

fn main() {
    let path = RelativePath::new("test.txt");
    println!("{:?}", path);

    let path = AbsPath::new(Path::new("/tmp/test.txt"));
    println!("{:?}", path);
}
