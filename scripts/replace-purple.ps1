$files = Get-ChildItem -Path "." -Include "*.tsx","*.ts","*.css" -Recurse | Where-Object {
    $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.next"
}

$replacements = @(
    [pscustomobject]@{From='#5B3A82'; To='#000000'},
    [pscustomobject]@{From='#5b3a82'; To='#000000'},
    [pscustomobject]@{From='#4a2e6b'; To='#111111'},
    [pscustomobject]@{From='#483063'; To='#000000'},
    [pscustomobject]@{From='#3D3B69'; To='#000000'},
    [pscustomobject]@{From='#2C2C54'; To='#000000'},
    [pscustomobject]@{From='purple-50';  To='neutral-100'},
    [pscustomobject]@{From='purple-700'; To='neutral-800'},
    [pscustomobject]@{From='purple-900'; To='neutral-900'}
)

$changed = @()
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $newContent = $content
    foreach ($r in $replacements) {
        $newContent = $newContent.Replace($r.From, $r.To)
    }
    if ($newContent -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
        $changed += $file.Name
    }
}

Write-Host "Files updated: $($changed.Count)"
$changed | ForEach-Object { Write-Host "  $_" }
