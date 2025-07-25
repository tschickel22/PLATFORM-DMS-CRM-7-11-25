              <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agreement Vault</h1>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading agreements...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold">Total Agreements</h3>
              <p className="text-2xl font-bold">{agreements.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold">Templates</h3>
              <p className="text-2xl font-bold">{templates.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold">Signed</h3>
              <p className="text-2xl font-bold">
                {agreements.filter(a => a.status === 'signed').length}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Recent Agreements</h2>
            {agreements.length > 0 ? (
              <div className="space-y-3">
                {agreements.slice(0, 5).map((agreement) => (
                  <div key={agreement.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{agreement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {agreement.type} • {agreement.status}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {agreement.created_at && new Date(agreement.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No agreements found</p>
                <p className="text-sm">Agreements will appear here when created</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>