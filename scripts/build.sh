
# kopiraj cijelu strukturu projekta pa *onda* mijenjaj svaki file njegovom obrađenom verzijom
# ILI
# obrađuj svaki file pojedinačno i postupno napravi strukturu.

find ../src -iname *py
pyminifier --obfuscate dede_view_app.py | grep -i "#" > file
find *.txt -exec awk 'END {print $0 "," FILENAME}' {} \;

mkdir -p ../target/dede/
tar -cvzf ../target/dede.tar.gz ../dede/


