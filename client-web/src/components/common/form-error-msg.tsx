export default function FormErrorMsg({ msg }: { msg?: string }) {
  return <span className="text-red-700 mt-2 text-xs">{msg}</span>;
}
