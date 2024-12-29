local RunService = game:GetService("RunService")

return {
	ReplicaServer = RunService:IsServer() and require(script:WaitForChild("ReplicaServer")) or {},
	ReplicaClient = RunService:IsClient() and require(script:WaitForChild("ReplicaClient")) or {},
}
