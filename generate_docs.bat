@echo off
echo Generating Project Documentation...

rem Create a temporary file for the documentation
set "DOC_FILE=Project_Documentation.md"

rem Add a title to the documentation
echo # Project Documentation > %DOC_FILE%
echo. >> %DOC_FILE%
echo Generated on %date% at %time% >> %DOC_FILE%
echo. >> %DOC_FILE%

rem List all files in the src directory recursively
echo ## File Structure >> %DOC_FILE%
echo. >> %DOC_FILE%
dir /s /b src >> %DOC_FILE%
echo. >> %DOC_FILE%

rem Append file contents for key source files
echo ## Source Code >> %DOC_FILE%
echo. >> %DOC_FILE%

for /r src %%f in (*.jsx *.js *.css) do (
    echo ### %%f >> %DOC_FILE%
    echo ``` >> %DOC_FILE%
    type "%%f" >> %DOC_FILE%
    echo ``` >> %DOC_FILE%
    echo. >> %DOC_FILE%
)

echo Documentation generated in %DOC_FILE%
