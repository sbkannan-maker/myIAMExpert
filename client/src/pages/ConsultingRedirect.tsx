import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ConsultingRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation("/expert", { replace: true }); }, [setLocation]);
  return null;
}
