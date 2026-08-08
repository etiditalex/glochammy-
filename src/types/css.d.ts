declare module "*.css" {
  const styles: { readonly [className: string]: string };
  export default styles;
}

declare module "*.scss" {
  const styles: { readonly [className: string]: string };
  export default styles;
}

declare module "leaflet/dist/leaflet.css" {
  const styles: { readonly [className: string]: string };
  export default styles;
}
