export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 bg-gray-200 rounded-lg p-3 max-w-[70%]">
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "200ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "400ms" }}
      ></div>
    </div>
  );
}
