let content = {
    electrical: {
        services: [
            "Inspection_and_Testing"
        ],
        blogs: [
            "UK_Qualification_Requirements",
            // "Cable_Calculations"
        ]
    },
    networking: {
        services: [],
        blogs: [
            "Networking_Terminology",
            "Hybrid_Cloud_Networking_to_Azure",
            "VXLAN"
        ]
    },
    operations: {
        services: [],
        blogs: [
            // "Openstack_Services",
            "Ceph_Cluster_Setup"
        ]
    }
}

// Use the file name to determine the service content to load
let directory = window.location.pathname.split('/').pop().split(".")[0]
let type = 'services'
let content_file = content[directory][0]
let current_index = 0

function update_content_type(dir, t) {
    directory = dir
    type = t
    content_file = content[dir][0]

    // Update the navigation
    update_nav(dir)

    // Update contents container
    show_content(0)
}

function show_content(index) {
    content_file = content[directory][type][index]
    fetch(`content/${type}/${directory}/${content_file.toLowerCase()}.txt`)
        .then(res => res.text())
        .then(text => {
            const lines = text.split('\n');
            let html = `<h2>${content_file.replaceAll("_", " ")}</h2>\n`;
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
    current_index = index
}

function next_content(operator) {
    switch (operator) {
        case '+':
            if (current_index + 1 == content[directory][type].length) {
                show_content(0)
            } else {
                show_content(current_index + 1)
            }
            break
        case '-':
            if (current_index > 0) {
                show_content(current_index - 1)
            }
            break
        default: throw new Error('Invalid operator');
    }
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function update_nav(target) {
    let html = `<h4>${type.toUpperCase()}</h4>`;

    for (var i = 0; i < content[target][type].length; i++) {
        content_file = content[target][type][i]
        html += `<li><button onclick="show_content(${i})">${content_file.replaceAll("_", " ")}</button></li>`
    }

    document.getElementById("left_nav").innerHTML = html;
}

update_nav(window.location.pathname.split('/').pop().split(".")[0])
show_content(0)
