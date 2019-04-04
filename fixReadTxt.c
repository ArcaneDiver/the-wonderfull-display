#include <stdio.h>

main() {
	FILE * fp = fopen("temp.txt", "rb");
	char a[1000];
	int i=0;
	if(!feof(fp)){
		while(!feof(fp)){
			fread(&a[i], sizeof(char), 1, fp);
	
			i++;
		}
		a[i-1] = 0;
	} else {
		a[0] = 'N ';
		a[1] = '\0';	
	}
	printf("%s", a);
	return 0;
}


