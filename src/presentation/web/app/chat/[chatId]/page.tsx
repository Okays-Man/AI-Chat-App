import ChatClient from "./ChatClient";

export default async function ChatPage({ 
  params 
}: { 
  params: Promise<{ chatId: string }> 
}) {
  const resolvedParams = await params;
  const chatId = parseInt(resolvedParams.chatId);

  return <ChatClient chatId={chatId} />;
}