from index_folder import index_folder
import pandas as pd
import argparse

# Create the parser
my_parser = argparse.ArgumentParser(description='List the content of a folder')

DEFAULT_PATH = R"D:\Downloads"

# Add the arguments
my_parser.add_argument('path', nargs="?", default=DEFAULT_PATH)
# my_parser.add_argument('path',
#                        metavar='path',
#                        type=str,
#                        help='the path to list',
#                     #    required= False, 
#                        default= DEFAULT_PATH)

# Execute the parse_args() method
args = my_parser.parse_args()

input_path = args.path

print(input_path)
print(pd.DataFrame(index_folder(input_path)))
