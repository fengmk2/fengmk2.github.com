fn main() {
    println!("Hello, world!");
}

#[test]
fn dbg_path() {
    use std::path::{Component, Path};
    let p = Path::new(r"C:/foo/.././bar");
    // let p = Path::new(r"/foo/bar");
    println!("abs={} root={} components={:?}", p.is_absolute(), p.has_root(), p.components().any(|c| matches!(c, Component::Prefix(_))));
    for c in p.components() {
        println!("{:?}", c);
    }
    println!("canonicalize={:?}", p.canonicalize());
    println!("parent={:?}", p.parent());
    println!("path={:?}", p);
    println!("path={:?}", p.join("/baz"));
}
