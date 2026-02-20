# upload-secrets-to-aws.ps1
# Script to upload .env file to AWS Secrets Manager
# Usage: .\scripts\upload-secrets-to-aws.ps1 -EnvFile .env-prod-geniefx -SecretName GenieFX-Prod-rest-api-v2-SM -Region eu-west-2

param(
    [Parameter(Mandatory=$true)]
    [string]$EnvFile,
    
    [Parameter(Mandatory=$true)]
    [string]$SecretName,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "eu-west-2",
    
    [Parameter(Mandatory=$false)]
    [string]$AwsProfile = ""
)

# Set AWS profile if provided
if ($AwsProfile -and $AwsProfile.Trim() -ne "") {
    $env:AWS_PROFILE = $AwsProfile.Trim()
    Write-Host "Using AWS Profile: $AwsProfile" -ForegroundColor Cyan
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Upload Environment Variables to AWS Secrets Manager" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is available
try {
    $null = aws --version
} catch {
    Write-Host "Error: AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

# Check if file exists
if (-not (Test-Path $EnvFile)) {
    Write-Host "Error: File not found: $EnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "Reading environment file: $EnvFile" -ForegroundColor Yellow
Write-Host "Secret Name: $SecretName" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

# Read the .env file
$envContent = Get-Content $EnvFile -Raw

# Parse environment variables into a hashtable
$envVars = @{}
$lines = $envContent -split "`n"

foreach ($line in $lines) {
    # Skip empty lines and comments
    $trimmedLine = $line.Trim()
    if ($trimmedLine -eq "" -or $trimmedLine.StartsWith("#")) {
        continue
    }
    
    # Parse KEY=VALUE format (handle leading whitespace)
    if ($trimmedLine -match '^\s*([^=]+?)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Skip empty keys
        if ($key -eq "") {
            continue
        }
        
        # Remove quotes if present (handle both single and double quotes)
        if ($value.Length -ge 2) {
            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or 
                ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }
        }
        
        # Store the key-value pair
        $envVars[$key] = $value
    }
}

Write-Host "Found $($envVars.Count) environment variables" -ForegroundColor Green
Write-Host ""

# Convert hashtable to JSON
$jsonContent = $envVars | ConvertTo-Json -Depth 10 -Compress

# Create a temporary file for the JSON content (UTF-8 without BOM)
$tempFile = [System.IO.Path]::GetTempFileName()
$utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($tempFile, $jsonContent, $utf8NoBomEncoding)

Write-Host "JSON content written to temporary file: $tempFile" -ForegroundColor Gray
Write-Host ""

# Check if secret already exists
Write-Host "Checking if secret exists..." -ForegroundColor Yellow
$secretExists = $false
try {
    $null = aws secretsmanager describe-secret --secret-id $SecretName --region $Region 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $secretExists = $true
        Write-Host "Secret already exists. Will update it." -ForegroundColor Yellow
    }
} catch {
    # Secret doesn't exist, will create it
    Write-Host "Secret does not exist. Will create it." -ForegroundColor Yellow
}

Write-Host ""

# Create or update the secret using file:// syntax
if ($secretExists) {
    Write-Host "Updating secret: $SecretName" -ForegroundColor Cyan
    $result = aws secretsmanager update-secret `
        --secret-id $SecretName `
        --secret-string "file://$tempFile" `
        --region $Region 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Secret updated successfully!" -ForegroundColor Green
        Write-Host $result
    } else {
        Write-Host "Error updating secret:" -ForegroundColor Red
        Write-Host $result
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
        exit 1
    }
} else {
    Write-Host "Creating secret: $SecretName" -ForegroundColor Cyan
    $result = aws secretsmanager create-secret `
        --name $SecretName `
        --secret-string "file://$tempFile" `
        --region $Region `
        --description "Environment variables for GenieFX Production REST API" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Secret created successfully!" -ForegroundColor Green
        Write-Host $result
    } else {
        Write-Host "Error creating secret:" -ForegroundColor Red
        Write-Host $result
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
        exit 1
    }
}

# Clean up temporary file
Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Write-Host "Temporary file cleaned up." -ForegroundColor Gray

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Verify the secret in AWS Console: https://console.aws.amazon.com/secretsmanager/home?region=$Region#/secret?name=$SecretName" -ForegroundColor Yellow
Write-Host "2. Update your ECS task definition to reference this secret" -ForegroundColor Yellow
Write-Host "3. Ensure your IAM role has permissions to read this secret" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
