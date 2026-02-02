import ChatPanel from '../components/ChatPanel'

export default function Chat({ getCatalogText }) {
  return (
    <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] flex flex-col pb-16 sm:pb-0">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-oak-100 bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl font-semibold text-oak-900">
            Sommelier AI
          </h1>
          <p className="text-oak-600 text-sm mt-0.5">
            Chiedi consigli sulla tua cantina o sul mondo del vino
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-3xl w-full mx-auto overflow-hidden">
        <ChatPanel getCatalogText={getCatalogText} />
      </div>
    </div>
  )
}
