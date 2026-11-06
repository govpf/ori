# Finalise les fichiers produits par build-word.mjs avec Word (Windows) :
# met à jour le sommaire, les numéros de figure et les titres courants,
# puis enregistre. Sans cette étape, le sommaire reste vide jusqu'à ce
# que l'utilisateur fasse « Mettre à jour les champs ».
#
#   powershell -File apps/example-fascicule/word/finalize-word.ps1 [-Only <motif>]
param(
  [string]$Dir = (Join-Path $PSScriptRoot '..\..\ori-site\public\telechargements'),
  [string]$Only = '*'
)
$ErrorActionPreference = 'Stop'
$files = Get-ChildItem (Resolve-Path $Dir).Path -Include *.docx, *.dotx -Recurse | Where-Object { $_.Name -like $Only }
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  foreach ($f in $files) {
    $doc = $word.Documents.Open($f.FullName, $false, $false, $false)
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    foreach ($story in $doc.StoryRanges) {
      $r = $story
      while ($r) { [void]$r.Fields.Update(); $r = $r.NextStoryRange }
    }
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    Write-Output ("{0} : {1} pages" -f $f.Name, $doc.ComputeStatistics(2))
    $doc.Save()
    $doc.Close($false)
  }
} finally {
  $word.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
