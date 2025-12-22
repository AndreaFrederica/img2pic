use wasm_bindgen::prelude::*;

// 当 console_error_panic_hook 功能启用时，可以更好地在浏览器中显示 panic 信息
#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

mod filters;
mod energy;
mod grid;

pub use filters::*;
pub use energy::*;
pub use grid::*;
