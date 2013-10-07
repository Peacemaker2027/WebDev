function calcAbilityMod(score, mod)//calculate skill score based on ability modifier
{
	var list_of_values = document.getElementsByName(mod);
	var val = "";
	if(document.getElementById(score).value)
	{
		val = Math.floor((document.getElementById(score).value-10)/2);
	}
	for(i=0; i<list_of_values.length; i++)
	{
		list_of_values[i].value = val;
	}
}

