import re

def is_filetype(filename, types):
    types = types.split(',')
    pattern = '\.(' + '|'.join([t.strip() for t in types]) + ')$';
    return re.search(pattern, filename, re.I) != None
    
print is_filetype('abc.doc', 'doc|txt|pdf')
print is_filetype('abc.exe', 'doc|txt|pdf')
print is_filetype('abc.txt', 'doc|txt|pdf')
print is_filetype('abc.pdf', 'doc|txt|pdf')
print is_filetype('abc', 'doc|txt|pdf')
