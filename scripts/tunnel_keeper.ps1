while ($true) {
    try {
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=6 -R 80:localhost:3000 nokey@localhost.run
    } catch {
        Write-Output "Reconnecting tunnel..."
    }
    Start-Sleep -Seconds 2
}
