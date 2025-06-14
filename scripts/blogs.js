let blogs = {
    electrical: [
        "UK_Qualification_Requirements",
        // "Cable_Calculations"
    ],
    networking: [
        "Networking_Terminology",
        "Routing_Protocols"
    ],
    operations: [
        "Openstack_Services"
    ]
}

let directory = 'electrical'
let blog_file = blogs[directory][0]

function update_service_type(dir) {
    directory = dir
    blog_file = blogs[dir][0]

    // Update the navigation
    update_nav(dir)

    // Update blogs container
    show_blog(0)
}

function show_blog(index) {
    blog_file = blogs[directory][index]
    fetch(`blogs/${directory}/${blog_file.toLowerCase()}.txt`)
        .then(res => res.text())
        .then(text => {
            const lines = text.split('\n');
            let html = `<h2>${blog_file.replaceAll("_", " ")}</h2>\n`;
            let inCode = false;
            let codeLang = '';
            let codeBuffer = [];

            lines.forEach(line => {
                const code_match = line.match(/^```(\w*)?/); // detect ``` or ```lang
                const h3_match = line.match(/^#[a-zA-Z0-9_ ]*$/); // detect #
                const h4_match = line.match(/^##[a-zA-Z0-9_ ]*$/); // detect #
                if (code_match) {
                    if (!inCode) {
                        // Start of code block
                        inCode = true;
                        codeLang = code_match[1] || '';
                        codeBuffer = [];
                    } else {
                        // End of code block
                        inCode = false;
                        html += `<pre><code class="language-${codeLang}">${escapeHtml(codeBuffer.join('\n'))}</code></pre>\n`;
                        codeLang = '';
                    }
                } else if (inCode) {
                    codeBuffer.push(line);
                } else if (h4_match) {
                    html += `<h4><i>${escapeHtml(line.replace("##", ""))}</i></h4>\n`;
                } else if (h3_match) {
                    html += `<br/><h3>${escapeHtml(line.replace("#", ""))}</h3>\n`;
                } else {
                    // Normal text
                    html += `<p>${escapeHtml(line)}</p>\n`;
                }
            });

            document.getElementById('output').innerHTML = html;
        });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function update_nav(target) {
    let html = `<h4>${target.toUpperCase()}</h4>`;

    for (var i = 0; i < blogs[target].length; i++) {
        blog_file = blogs[target][i]
        html += `<li><button onclick="show_blog(${i})">${blog_file.replaceAll("_", " ")}</button></li>`
    }

    document.getElementById("left_nav").innerHTML = html;
}

update_nav('electrical')
show_blog(0)
