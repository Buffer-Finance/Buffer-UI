import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Prop {
  id: string;
  children: any;
  name?: string;
  //   show: boolean
}

let ClientOnlyPortal: React.FC<Prop> = ({ children, id, name }) => {
  const ref = useRef<any>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    ref.current = document.querySelector("#" + id);
    setMounted(true);
  }, [id]);

  return mounted ? createPortal(children, ref.current) : null;
};
export default ClientOnlyPortal;
