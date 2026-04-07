export default function Footer() {
  return (
    <footer className="border-t border-border py-4 px-6 text-center">
      <p className="text-xs text-on-surface-muted">
        © {new Date().getFullYear()} SENTINEL. Todos los derechos reservados.
      </p>
    </footer>
  );
}