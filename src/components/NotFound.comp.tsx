import { useRouteError } from "react-router-dom";

export default function NotFound() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <p>Error: Page not found</p>
    </div>
  );
}