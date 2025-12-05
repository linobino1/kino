import { getPayload } from '~/util/getPayload.server'

export async function loader() {
  try {
    const payload = await getPayload()

    // Access the Mongoose connection
    const connection = payload.db.connection

    // Get MongoDB client from Mongoose connection
    const client = connection.getClient()

    // Get connection pool statistics
    const poolStats = {
      // Mongoose connection info
      readyState: connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
      host: connection.host,
      name: connection.name,

      // MongoDB driver pool options
      poolSize: client.options?.maxPoolSize || 'default',
      minPoolSize: client.options?.minPoolSize || 0,
      maxIdleTimeMS: client.options?.maxIdleTimeMS || 'none',
      waitQueueTimeoutMS: client.options?.waitQueueTimeoutMS || 'default',
    }

    // Get server status for connection metrics
    const adminDb = connection.db?.admin()
    if (!adminDb) {
      throw new Error('Admin database not available')
    }

    const serverStatus = await adminDb.serverStatus()

    const connectionMetrics = {
      current: serverStatus.connections.current,
      available: serverStatus.connections.available,
      totalCreated: serverStatus.connections.totalCreated,
      active: serverStatus.connections.active,
      threaded: serverStatus.connections.threaded,
      exhaustIsMaster: serverStatus.connections.exhaustIsMaster,
      exhaustHello: serverStatus.connections.exhaustHello,
      awaitingTopologyChanges: serverStatus.connections.awaitingTopologyChanges,
    }

    // Database statistics
    const dbStats = await connection.db?.stats()

    return Response.json({
      poolConfig: poolStats,
      connectionMetrics,
      database: {
        collections: dbStats?.collections,
        dataSize: dbStats?.dataSize,
        storageSize: dbStats?.storageSize,
        indexes: dbStats?.indexes,
        indexSize: dbStats?.indexSize,
        objects: dbStats?.objects,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to get pool stats' },
      { status: 500 },
    )
  }
}
